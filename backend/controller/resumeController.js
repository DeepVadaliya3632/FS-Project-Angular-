import Resume from '../models/resumeModel.js';
import path from 'path';
import fs from 'fs';

export const getResume = async (req, res) => {
    try{    
        const {title} = req.body;
        // default template

        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user._id,
            title,
                ...defaultResumeData,
                ...req.body
        })

        res.status(201).json({newResume})
    }
    catch(error) {
        res.status(500).json({message: 'Failed to create resume', error: error.message});
    }
}

// get function 

export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({userId: req.user._id}).sort({
            updatedAt: -1
        });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({message: 'Failed to retrieve resumes', error: error.message});
    }
}

// get resume by id

export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({_id: req.params.id, userId: req.user._id});

        if(!resume) {
            return res.status(404).json({message: 'Resume not found'});
        }
        res.json(resume);
    }
    catch (error) {
        res.status(500).json({message: 'Failed to retrieve resume', error: error.message});
    }
}

// update resume function

export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({_id: req.params.id, userId: req.user._id});
        if(!resume) {
            return res.status(404).json({message: 'Resume not found or not authorized'});
        }

        // merge updated resume
        Object.assign(resume, req.body);

        // saving updated resume
        const savedResume = await resume.save();
        res.json(savedResume);
    }
    catch (error) {
        res.status(500).json({message: 'Failed to update resume', error: error.message});
    }
}

// function to delete a resume
export const deleteResume = async (req, res) => {
    try {
        // Find the resume by _id and userId
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or not authorized' });
        }

        const uploadsFolder = path.join(process.cwd(), 'uploads');

        // Delete thumbnail if it exists
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
        }

        // Delete profile preview image if it exists
        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfilePreview = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
            if (fs.existsSync(oldProfilePreview)) {
                fs.unlinkSync(oldProfilePreview);
            }
        }

        // Delete the resume document
        await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ message: 'Failed to delete resume', error: error.message });
    }
};