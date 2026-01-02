import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import {
  ArrowLeftIcon,
  FolderIcon,
  GraduationCap,
  User,
  FileText,
  Briefcase,
  Sparkle,
  ChevronRight,
  ChevronLeft,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon
} from 'lucide-react'
import { Eye, EyeOff, Download, Share2 } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const {token} = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "project", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkle },
  ]

  const loadExistingResume = async () => {
    try {
      const {data} = await api.get('/api/resumes/get/'+resumeId,{
        headers: {Authorization : token}}
      )
      if(data.resume)
      {
          setResumeData(data.resume)
          document.title = data.resume.title;
      }
    } catch (error) {
        console.log(error.message);
    }
  }

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
  }, [])
 const changeResumeVisibility = async ()=>{
   try {
      const formData = new FormData()
      formData.append("resumeId",resumeId)
      formData.append("resumeData",JSON.stringify({public:!resumeData.public}))

      const {data} = await api.put('/api/resumes/update',formData,{headers:{Authorization: token}})

      setResumeData({...resumeData,public:!resumeData.public})
      toast.success(data.message)
   } catch (error) {
      console.error("Error saving resume : ",error);
      
   }
 }
 const handleShare = () =>{
   const frontendUrl = window.location.href.split('/app/')[0];
   const resumeUrl = frontendUrl + '/view/' + resumeId;
   if(navigator.share)
   {
      navigator.share({url:resumeUrl,text:"My Resume",})
   }
   else{
      alert('Share not Supported on this browser.')
   }
 }
 const downloadResume  = ()=>{
  window.print();
 }
 const saveResume = async () => {
    try {
       let updatedResumeData = structuredClone(resumeData)

       if(typeof resumeData.personal_info.image==='object')
       {
           delete updatedResumeData.personal_info.image
       }
       const formData = new FormData();
       formData.append("resumeId",resumeId)
       formData.append("resumeData",JSON.stringify(updatedResumeData))
       removeBackground && formData.append("removeBackground","yes");
       typeof resumeData.personal_info.image === 'object' && formData.append("image",resumeData.personal_info.image)

       const {data} = await api.put('/api/resumes/update',formData,{headers:{Authorization: token}})

       setResumeData(data.resume)
       toast.success(data.message)
    } catch (error) {
       console.error("Error saving resume",error);
       
    }
 }
  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='size-4' /> Back To Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr
                className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000'
                style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }}
              />

              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
               <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData(prev => ({ ...prev, template }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData(prev => ({ ...prev, accent_color: color }))
                    }
                  />
                </div>

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() => setActiveSectionIndex(prev => Math.max(prev - 1, 0))}
                      className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'
                      disabled={activeSectionIndex === 0}
                    > Previous
                      <ChevronLeft className="size-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setActiveSectionIndex(prev => Math.min(prev + 1, sections.length - 1))}
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              <div className='space-y-6'>
                {activeSection.id === 'personal' &&(
                  <PersonalInfoForm data={resumeData.personal_info}
                  onChange={(data)=>setResumeData(prev => ({...prev,personal_info:data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}/>
                )}
                {
                  activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary}
                  onChange={(data)=>setResumeData(prev => ({...prev,professional_summary:data}))} setResumeData={setResumeData}/>
                  )
                }
                {
                  activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience}
                  onChange={(data)=>setResumeData(prev => ({...prev,experience:data}))}/>
                  )
                }
                {
                  activeSection.id === 'education' && (
                    <EducationForm data={resumeData.education}
                      onChange={(data) =>
                        setResumeData(prev => ({ ...prev, education: data }))
                      }
                    />
                  )
                }
                {
                  activeSection.id === 'project' && (
                    <ProjectForm data={resumeData.project}
                      onChange={(data) =>
                        setResumeData(prev => ({ ...prev, project: data }))
                      }
                    />
                  )
                }
                {
                  activeSection.id === 'skills' && (
                    <SkillsForm data={resumeData.skills}
                      onChange={(data) =>
                        setResumeData(prev => ({ ...prev, skills: data }))
                      }
                    />
                  )
                }
              </div>
              <button onClick={()=>{toast.promise(saveResume,{loading:"Saving..."})}} className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
              Save Changes
              </button>
            </div>
          </div>
                  {/* right */}
          <div className='lg:col-span-7 max-lg:mt-6'>
  <div className='relative w-full'>
    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">

      {/* Share Button */}
      {resumeData.public && (
        <button
          type="button"
          onClick={handleShare}
          className='flex items-center gap-2 px-4 py-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-colors'
        >
          <Share2 size={16} />
          Share
        </button>
      )}

      {/* Public/Private Toggle */}
      <button
        type="button"
        onClick={changeResumeVisibility}
        className={`flex items-center gap-2 px-4 py-2 text-xs rounded-lg transition-colors 
          ${resumeData.public 
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        {resumeData.public ? <Eye size={16} /> : <EyeOff size={16} />}
        {resumeData.public ? 'Public' : 'Private'}
      </button>

      {/* Download Button */}
      <button
        type="button"
        onClick={downloadResume}
        className='flex items-center gap-2 px-4 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg hover:from-green-200 hover:to-green-300 transition-colors'
      >
        <Download size={16} />
        Download
      </button>

    </div>
  </div>

  {/* Resume Preview */}
  <ResumePreview
    data={resumeData}
    template={resumeData.template}
    accentColor={resumeData.accent_color}
  />
</div>

        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
