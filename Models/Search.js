import mongoose from "mongoose";

const SearchSchema = new mongoose.Schema({
    searchInternships:{
        type: Array,
        default:[]
    },
    searchJobs:{
        type: Array,
        default:[]
    },
    searchCourses:{
        type: Array,
        default:[]
    }

},
{
    timestamps:true
})

export const Search = mongoose.model('Search',SearchSchema)