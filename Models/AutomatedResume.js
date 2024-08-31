import mongoose, { Mongoose } from "mongoose";
const Schema = mongoose.Schema;

// Personal Information Schema
const personalInfoSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  linkedin: { type: String },
  github: { type: String },
});

// Education Schema
const educationSchema = new Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  percentage: { type: String },
});

// Experience Schema
const experienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  responsibilities: { type: [String], required: true },
  achievements: { type: [String] },
});

// Skills Schema
const skillsSchema = new Schema({
  skillName: { type: String, required: true },
  level: { type: String, required: true }, // Beginner, Intermediate, Advanced
});

// Projects Schema
const projectsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
  technologies: { type: [String], required: true },
});

const courseSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    organization: { type:String, required: true },
  });

  const achievementSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
  });
  

// Main Resume Schema
const resumeSchema = new Schema({
  candidateID:{ type: mongoose.Schema.Types.ObjectId, ref:"Candidate"},
  personalInfo: { type: personalInfoSchema, required: true },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [skillsSchema],
  projects: [projectsSchema],
  courses: [courseSchema],
  achievements: [achievementSchema],

  createdAt: { type: Date, default: Date.now },
});

export const AutomatedResume = mongoose.model('AutomatedResume', resumeSchema);
