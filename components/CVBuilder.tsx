import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Download, Plus, Trash2 } from 'lucide-react';

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  period: string;
}

const CVBuilder: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    summary: ''
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const addExperience = () => {
    setExperiences([...experiences, { company: '', position: '', period: '', description: '' }]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, { school: '', degree: '', period: '' }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(personalInfo.name || 'VOTRE NOM', margin, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(personalInfo.title || 'VOTRE TITRE', margin, y);
    y += 15;

    // Contact Info
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const contact = `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.address}`;
    doc.text(contact, margin, y);
    y += 10;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 190, y);
    y += 15;

    // Summary
    if (personalInfo.summary) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RÉSUMÉ PROFESSIONNEL', margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(personalInfo.summary, 170);
      doc.text(lines, margin, y);
      y += (lines.length * 5) + 10;
    }

    // Experience
    if (experiences.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EXPÉRIENCE PROFESSIONNELLE', margin, y);
      y += 7;
      
      experiences.forEach(exp => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${exp.position} - ${exp.company}`, margin, y);
        doc.setFont('helvetica', 'italic');
        doc.text(exp.period, 190, y, { align: 'right' });
        y += 5;
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(exp.description, 170);
        doc.text(lines, margin, y);
        y += (lines.length * 5) + 7;
      });
      y += 5;
    }

    // Education
    if (education.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('FORMATION', margin, y);
      y += 7;
      
      education.forEach(edu => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.degree, margin, y);
        doc.setFont('helvetica', 'italic');
        doc.text(edu.period, 190, y, { align: 'right' });
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(edu.school, margin, y);
        y += 10;
      });
      y += 5;
    }

    // Skills
    if (skills.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPÉTENCES', margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(skills.join(', '), margin, y);
    }

    doc.save('mon_cv_wanzcorp.pdf');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="space-y-8">
          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-black text-white mb-6 flex items-center">
              <User className="mr-3 text-brand-accent" size={20} />
              Informations Personnelles
            </h3>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Nom Complet"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-accent outline-none"
              />
              <input
                type="text"
                placeholder="Titre Professionnel"
                value={personalInfo.title}
                onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-accent outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-accent outline-none"
                />
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-accent outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Adresse"
                value={personalInfo.address}
                onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-accent outline-none"
              />
              <textarea
                placeholder="Résumé professionnel"
                value={personalInfo.summary}
                onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-accent outline-none"
              />
            </div>
          </section>

          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white flex items-center">
                <Briefcase className="mr-3 text-brand-accent" size={20} />
                Expériences
              </h3>
              <button onClick={addExperience} className="text-brand-accent hover:scale-110 transition-transform">
                <Plus size={24} />
              </button>
            </div>
            <div className="space-y-6">
              {experiences.map((exp, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative group">
                  <button 
                    onClick={() => removeExperience(i)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="Entreprise"
                        value={exp.company}
                        onChange={(e) => updateExperience(i, 'company', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-brand-accent"
                      />
                      <input
                        placeholder="Période"
                        value={exp.period}
                        onChange={(e) => updateExperience(i, 'period', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-brand-accent"
                      />
                    </div>
                    <input
                      placeholder="Poste"
                      value={exp.position}
                      onChange={(e) => updateExperience(i, 'position', e.target.value)}
                      className="bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-brand-accent"
                    />
                    <textarea
                      placeholder="Description des missions"
                      value={exp.description}
                      onChange={(e) => updateExperience(i, 'description', e.target.value)}
                      className="bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white flex items-center">
                <GraduationCap className="mr-3 text-brand-accent" size={20} />
                Formation
              </h3>
              <button onClick={addEducation} className="text-brand-accent hover:scale-110 transition-transform">
                <Plus size={24} />
              </button>
            </div>
            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative group">
                  <button 
                    onClick={() => removeEducation(i)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="grid gap-4">
                    <input
                      placeholder="École / Université"
                      value={edu.school}
                      onChange={(e) => updateEducation(i, 'school', e.target.value)}
                      className="bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-brand-accent"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="Diplôme"
                        value={edu.degree}
                        onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-brand-accent"
                      />
                      <input
                        placeholder="Période"
                        value={edu.period}
                        onChange={(e) => updateEducation(i, 'period', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-black text-white mb-6 flex items-center">
              <Code className="mr-3 text-brand-accent" size={20} />
              Compétences
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, i) => (
                <span key={i} className="bg-brand-accent/20 text-brand-accent px-3 py-1 rounded-full text-sm flex items-center">
                  {skill}
                  <button onClick={() => removeSkill(i)} className="ml-2 hover:text-white">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                placeholder="Ajouter une compétence..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-accent"
              />
              <button onClick={addSkill} className="p-2 bg-brand-accent text-brand-dark rounded-xl">
                <Plus size={20} />
              </button>
            </div>
          </section>

          <button
            onClick={generatePDF}
            className="w-full py-5 bg-brand-accent text-brand-dark font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-brand-accent/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            <Download className="mr-3" size={20} />
            Télécharger mon CV (PDF)
          </button>
        </div>

        {/* Preview */}
        <div className="hidden lg:block sticky top-32 h-fit">
          <div className="bg-white rounded-lg shadow-2xl p-12 min-h-[800px] text-gray-800 font-serif">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-tight">{personalInfo.name || 'Votre Nom'}</h1>
              <p className="text-xl text-brand-accent font-medium">{personalInfo.title || 'Votre Titre'}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center"><Mail size={14} className="mr-1" /> {personalInfo.email || 'email@exemple.com'}</span>
                <span className="flex items-center"><Phone size={14} className="mr-1" /> {personalInfo.phone || '00 00 00 00 00'}</span>
                <span className="flex items-center"><MapPin size={14} className="mr-1" /> {personalInfo.address || 'Ville, Pays'}</span>
              </div>
            </div>

            <div className="h-px bg-gray-200 mb-8"></div>

            {personalInfo.summary && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Résumé</h2>
                <p className="text-sm leading-relaxed text-gray-600">{personalInfo.summary}</p>
              </div>
            )}

            {experiences.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Expérience</h2>
                <div className="space-y-6">
                  {experiences.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-800">{exp.position || 'Poste'}</h3>
                        <span className="text-xs text-gray-500 italic">{exp.period || 'Période'}</span>
                      </div>
                      <p className="text-sm text-brand-accent font-medium mb-2">{exp.company || 'Entreprise'}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{exp.description || 'Description des missions...'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Formation</h2>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-800">{edu.degree || 'Diplôme'}</h3>
                        <span className="text-xs text-gray-500 italic">{edu.period || 'Période'}</span>
                      </div>
                      <p className="text-sm text-gray-600">{edu.school || 'École'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Compétences</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
