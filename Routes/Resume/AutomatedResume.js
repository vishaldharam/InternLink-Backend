import express from 'express'
import { AutomatedResume } from '../../Models/AutomatedResume.js'
import passport from 'passport'
export const AutomatedResumeRouter = express.Router()

AutomatedResumeRouter.post('/addAutomatedResume',passport.authenticate('candidate',{session:false}), 
    async (req, res) => {
                             
        const { personalInfo, education, experience, skills, projects, courses, achievements } = req.body;

        // Basic checks for required fields
        if (!personalInfo || !personalInfo.name || !personalInfo.email || !personalInfo.phone) {
          return res.status(400).send({ error: 'Personal information with name, email, and phone is required' });
        }
      
        if (!education || !Array.isArray(education) || education.length === 0) {
          return res.status(400).send({ error: 'At least one education entry is required' });
        }
      
        if (!experience || !Array.isArray(experience) || experience.length === 0) {
          return res.status(400).send({ error: 'At least one experience entry is required' });
        }

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).send({ error: 'At least one experience entry is required' });
          }

        const isExists = await AutomatedResume.findOne({candidateID:req.user._id})
        if(isExists){
            return res.status(400).send({ error: 'Resume is already exits no need to create new one' });

        }
        try {
          const newResume = await AutomatedResume.create({
            candidateID:req.user._id,
            personalInfo,
            education,
            experience,
            skills,
            projects,
            courses,
            achievements
          });
          res.status(201).send({ message: 'Resume saved successfully!', resume: newResume });
        } catch (error) {
          console.error('Error saving resume:', error);
          res.status(500).send({ error: 'Failed to save resume', details: error.message });
        }
                                 

    })

AutomatedResumeRouter.post('/updateAutomatedResume',passport.authenticate('candidate',{session:false}), 
    async (req, res) => {
                             
        const { personalInfo, education, experience, skills, projects, courses, achievements } = req.body;

        // Basic checks for required fields
        if (!personalInfo || !personalInfo.name || !personalInfo.email || !personalInfo.phone) {
          return res.status(400).send({ error: 'Personal information with name, email, and phone is required' });
        }
      
        if (!education || !Array.isArray(education) || education.length === 0) {
          return res.status(400).send({ error: 'At least one education entry is required' });
        }
      
        if (!experience || !Array.isArray(experience) || experience.length === 0) {
          return res.status(400).send({ error: 'At least one experience entry is required' });
        }

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).send({ error: 'At least one experience entry is required' });
          }

        const isExists = await AutomatedResume.findOne({candidateID:req.user._id})
        if(!isExists){
            return res.status(400).send({ error: 'No resume exists' });

        }
        try {
          const newResume = await AutomatedResume.findOneAndUpdate({candidateID:req.user._id},{
            personalInfo,
            education,
            experience,
            skills,
            projects,
            courses,
            achievements
          });
          res.status(201).send({ message: 'Resume updated successfully!', UpdatedResume: newResume });
        } catch (error) {
          console.error('Error saving resume:', error);
          res.status(500).send({ error: 'Failed to update resume', details: error.message });
        }
                                 

    })

AutomatedResumeRouter.get('/getAutomatedResume',passport.authenticate('candidate',{session:false}), 
    async (req, res) => {
                             
       
        if (!req.user._id) {
            return res.status(400).send({ error: 'At least one experience entry is required' });
          }

        try {       
            const isExists = await AutomatedResume.findOne({candidateID:req.user._id})
            if(!isExists){
                return res.status(400).send({ error: 'No resume exists' });
            }
        
            res.status(201).send({ message: 'Resume Fetched successfully!', Resume: isExists });
        } catch (error) {
          res.status(500).send({ error: 'Failed to fetch resume', details: error.message });
        }
                                 

    })

AutomatedResumeRouter.get('/getAutomatedResumeByEmployee',passport.authenticate('employee',{session:false}), 
    async (req, res) => {
        if (!req.body) {
            return res.status(400).send({ error: 'Invalid Data' });
          }
                             
       const {candidateID} = req.body
        if (!candidateID) {
            return res.status(400).send({ error: 'At least one experience entry is required' });
          }

        try {       
            const isExists = await AutomatedResume.findOne({candidateID})
            if(!isExists){
                return res.status(400).send({ error: 'No resume exists' });
            }
        
            res.status(201).send({ message: 'Resume Fetched successfully!', Resume: isExists });
        } catch (error) {
          res.status(500).send({ error: 'Failed to fetch resume', details: error.message });
        }
                                 

    })


