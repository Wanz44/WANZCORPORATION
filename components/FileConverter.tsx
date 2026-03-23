
import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument } from 'pdf-lib';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

type ConversionType = 'pdf-to-img' | 'img-to-pdf' | 'word-to-pdf' | 'excel-to-pdf' | 'pdf-to-excel' | 'video-to-audio' | 'merge-pdf' | 'split-pdf' | 'excel-cleaner';

const FileConverter: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [conversionType, setConversionType] = useState<ConversionType>('pdf-to-img');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const cleanExcelData = async (file: File) => {
    setStatus('Nettoyage du fichier Excel...');
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    // 1. Remove duplicates (based on all columns)
    const uniqueData = Array.from(new Set(jsonData.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
    setProgress(30);

    // 2. Normalize dates and phone numbers
    const cleanedData = uniqueData.map(row => {
      const newRow = { ...row };
      for (const key in newRow) {
        const val = newRow[key];
        
        // Normalize Phone Numbers (assuming they might be strings or numbers)
        if (typeof val === 'string' && (key.toLowerCase().includes('tel') || key.toLowerCase().includes('phone') || key.toLowerCase().includes('mobile'))) {
          // Remove non-digits, keep leading + if present
          newRow[key] = val.replace(/[^\d+]/g, '');
        }

        // Normalize Dates (basic check for common date formats)
        if (typeof val === 'string' && (key.toLowerCase().includes('date'))) {
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            newRow[key] = date.toISOString().split('T')[0]; // YYYY-MM-DD
          }
        }
      }
      return newRow;
    });
    setProgress(70);

    const newWs = XLSX.utils.json_to_sheet(cleanedData);
    const newWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWb, newWs, "Données Nettoyées");
    XLSX.writeFile(newWb, `${file.name.split('.')[0]}_nettoye.xlsx`);
    setProgress(100);
  };

  const mergePdfs = async (files: File[]) => {
    setStatus('Fusion des PDF...');
    const mergedPdf = await PDFDocument.create();
    
    for (let i = 0; i < files.length; i++) {
      setStatus(`Traitement du fichier ${i + 1}/${files.length}...`);
      setProgress(((i + 1) / files.length) * 100);
      const arrayBuffer = await files[i].arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged_document.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const splitPdf = async (file: File) => {
    setStatus('Division du PDF...');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const zip = new JSZip();
    const totalPages = pdf.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      setStatus(`Extraction de la page ${i + 1}/${totalPages}...`);
      setProgress(((i + 1) / totalPages) * 100);
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      const pdfBytes = await newPdf.save();
      zip.file(`page-${i + 1}.pdf`, pdfBytes);
    }

    setStatus('Génération du fichier ZIP...');
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name.split('.')[0]}_split.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const convertVideoToAudio = async (file: File) => {
    setStatus('Décodage de la vidéo...');
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    
    try {
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setStatus('Encodage de l\'audio (WAV)...');
      setProgress(50);

      // Simple WAV encoding
      const numOfChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length * numOfChannels * 2 + 44;
      const buffer = new ArrayBuffer(length);
      const view = new DataView(buffer);

      // WAV Header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + audioBuffer.length * numOfChannels * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numOfChannels, true);
      view.setUint32(24, audioBuffer.sampleRate, true);
      view.setUint32(28, audioBuffer.sampleRate * numOfChannels * 2, true);
      view.setUint16(32, numOfChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, audioBuffer.length * numOfChannels * 2, true);

      // Write PCM data
      const offset = 44;
      for (let i = 0; i < audioBuffer.length; i++) {
        for (let channel = 0; channel < numOfChannels; channel++) {
          const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
          view.setInt16(offset + (i * numOfChannels + channel) * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        }
        if (i % 1000 === 0) setProgress(50 + (i / audioBuffer.length) * 50);
      }

      const blob = new Blob([view], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.split('.')[0]}.wav`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      throw new Error('Impossible de décoder l\'audio de cette vidéo.');
    } finally {
      audioContext.close();
    }
  };

  const convertPdfToImages = async (file: File) => {
    setStatus('Chargement du PDF...');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const zip = new JSZip();
    const totalPages = pdf.numPages;

    for (let i = 1; i <= totalPages; i++) {
      setStatus(`Conversion de la page ${i}/${totalPages}...`);
      setProgress((i / totalPages) * 100);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await (page.render({ canvasContext: context, viewport } as any)).promise;
        const imgData = canvas.toDataURL('image/png');
        const base64Data = imgData.replace(/^data:image\/(png|jpg);base64,/, "");
        zip.file(`page-${i}.png`, base64Data, { base64: true });
      }
    }

    setStatus('Génération du fichier ZIP...');
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name.split('.')[0]}_images.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const convertImagesToPdf = async (files: File[]) => {
    setStatus('Génération du PDF...');
    const pdf = new jsPDF();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setStatus(`Ajout de l'image ${i + 1}/${files.length}...`);
      setProgress(((i + 1) / files.length) * 100);
      
      const imgData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => (img.onload = resolve));

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (img.height * imgWidth) / img.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }

    pdf.save('images_converted.pdf');
  };

  const convertWordToPdf = async (file: File) => {
    setStatus('Lecture du fichier Word...');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;

    const pdf = new jsPDF();
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.width = `${pageWidth}mm`;
    tempDiv.style.padding = '10px';
    tempDiv.style.fontSize = '12px';
    tempDiv.style.color = '#000';
    tempDiv.style.backgroundColor = '#fff';
    document.body.appendChild(tempDiv);

    await pdf.html(tempDiv, {
      callback: (doc) => {
        doc.save(`${file.name.split('.')[0]}.pdf`);
        document.body.removeChild(tempDiv);
      },
      x: margin,
      y: margin,
      width: pageWidth,
      windowWidth: 800
    });
  };

  const convertExcelToPdf = async (file: File) => {
    setStatus('Lecture du fichier Excel...');
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const html = XLSX.utils.sheet_to_html(worksheet);

    const pdf = new jsPDF('l', 'mm', 'a4');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.padding = '10px';
    document.body.appendChild(tempDiv);

    await pdf.html(tempDiv, {
      callback: (doc) => {
        doc.save(`${file.name.split('.')[0]}.pdf`);
        document.body.removeChild(tempDiv);
      },
      x: 10,
      y: 10,
      width: 270,
      windowWidth: 1200
    });
  };

  const convertPdfToExcel = async (file: File) => {
    setStatus('Extraction des données du PDF...');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const data: string[][] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      data.push([`Page ${i}`, pageText]);
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Données PDF");
    XLSX.writeFile(wb, `${file.name.split('.')[0]}.xlsx`);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    setProgress(0);
    setStatus('Initialisation...');

    try {
      switch (conversionType) {
        case 'pdf-to-img':
          await convertPdfToImages(files[0]);
          break;
        case 'img-to-pdf':
          await convertImagesToPdf(files);
          break;
        case 'word-to-pdf':
          await convertWordToPdf(files[0]);
          break;
        case 'excel-to-pdf':
          await convertExcelToPdf(files[0]);
          break;
        case 'pdf-to-excel':
          await convertPdfToExcel(files[0]);
          break;
        case 'video-to-audio':
          await convertVideoToAudio(files[0]);
          break;
        case 'merge-pdf':
          await mergePdfs(files);
          break;
        case 'split-pdf':
          await splitPdf(files[0]);
          break;
        case 'excel-cleaner':
          await cleanExcelData(files[0]);
          break;
      }
      setStatus('Conversion terminée !');
    } catch (error) {
      console.error(error);
      setStatus('Erreur lors de la conversion.');
    } finally {
      setIsConverting(false);
      setProgress(100);
    }
  };

  const conversionOptions = [
    { id: 'pdf-to-img', label: 'PDF vers Image', icon: 'fa-file-image', color: 'from-orange-500/20 to-orange-600/20' },
    { id: 'img-to-pdf', label: 'Image vers PDF', icon: 'fa-file-pdf', color: 'from-red-500/20 to-red-600/20' },
    { id: 'word-to-pdf', label: 'Word vers PDF', icon: 'fa-file-word', color: 'from-blue-500/20 to-blue-600/20' },
    { id: 'excel-to-pdf', label: 'Excel vers PDF', icon: 'fa-file-excel', color: 'from-green-500/20 to-green-600/20' },
    { id: 'pdf-to-excel', label: 'PDF vers Excel', icon: 'fa-table', color: 'from-emerald-500/20 to-emerald-600/20' },
    { id: 'video-to-audio', label: 'Vidéo vers Audio', icon: 'fa-file-audio', color: 'from-purple-500/20 to-purple-600/20' },
    { id: 'merge-pdf', label: 'Fusionner PDF', icon: 'fa-layer-group', color: 'from-cyan-500/20 to-cyan-600/20' },
    { id: 'split-pdf', label: 'Diviser PDF', icon: 'fa-scissors', color: 'from-pink-500/20 to-pink-600/20' },
    { id: 'excel-cleaner', label: 'Nettoyeur Excel', icon: 'fa-broom', color: 'from-yellow-500/20 to-yellow-600/20' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass p-1 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {conversionOptions.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setConversionType(type.id as ConversionType);
                  setFiles([]);
                  setStatus('');
                  setProgress(0);
                }}
                className={`p-6 rounded-3xl border transition-all flex flex-col items-center justify-center space-y-3 relative overflow-hidden group ${
                  conversionType === type.id
                    ? `bg-gradient-to-br ${type.color} border-brand-accent text-brand-accent shadow-lg shadow-brand-accent/10`
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 transition-transform group-hover:scale-110 ${
                  conversionType === type.id ? 'bg-brand-accent/20' : 'bg-white/5'
                }`}>
                  <i className={`fas ${type.icon} text-2xl`}></i>
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-center leading-tight">{type.label}</span>
                {conversionType === type.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-brand-accent"
                  />
                )}
              </motion.button>
            ))}
          </div>

          <motion.div 
            layout
            className="relative"
          >
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-brand-accent'); }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-brand-accent'); }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-brand-accent');
                if (e.dataTransfer.files) {
                  setFiles(Array.from(e.dataTransfer.files));
                }
              }}
              className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 text-center cursor-pointer hover:border-brand-accent/50 transition-all group bg-white/5 relative overflow-hidden"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple={conversionType === 'img-to-pdf' || conversionType === 'merge-pdf'}
                className="hidden"
                accept={
                  conversionType === 'pdf-to-img' || conversionType === 'pdf-to-excel' || conversionType === 'merge-pdf' || conversionType === 'split-pdf' ? '.pdf' :
                  conversionType === 'img-to-pdf' ? 'image/*' :
                  conversionType === 'word-to-pdf' ? '.doc,.docx' :
                  conversionType === 'excel-to-pdf' || conversionType === 'excel-cleaner' ? '.xls,.xlsx' :
                  conversionType === 'video-to-audio' ? 'video/*' : '*'
                }
              />
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-inner">
                  <i className="fas fa-cloud-upload-alt text-4xl text-brand-accent"></i>
                </div>
                <h4 className="text-2xl font-black text-white mb-3">
                  {files.length > 0 ? `${files.length} fichier(s) prêt(s)` : 'Déposez vos fichiers ici'}
                </h4>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mb-2">
                  ou cliquez pour parcourir votre ordinateur
                </p>
                <div className="flex justify-center space-x-2">
                  {files.map((f, i) => (
                    <span key={i} className="text-[10px] bg-brand-accent/20 text-brand-accent px-3 py-1 rounded-full font-bold">
                      {f.name.length > 20 ? f.name.substring(0, 17) + '...' : f.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Decorative background elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-brand-accent rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-brand-purple rounded-full blur-3xl"></div>
              </div>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 space-y-6"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400 font-black uppercase tracking-[0.2em]">
                    <span className="flex items-center">
                      {isConverting && <i className="fas fa-circle-notch fa-spin mr-2 text-brand-accent"></i>}
                      {status || 'Prêt pour la conversion'}
                    </span>
                    <span className="text-brand-accent">{Math.round(progress)}%</span>
                  </div>
                  
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-brand-accent to-brand-purple rounded-full shadow-[0_0_15px_rgba(0,255,240,0.3)]"
                    ></motion.div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setFiles([])}
                      disabled={isConverting}
                      className="px-8 py-5 bg-white/5 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleConvert}
                      disabled={isConverting}
                      className="flex-1 py-5 bg-brand-accent text-brand-dark font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-brand-accent/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 relative overflow-hidden group"
                    >
                      <span className="relative z-10">
                        {isConverting ? 'Traitement en cours...' : 'Lancer la conversion'}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FileConverter;
