import { Collection, ObjectId } from "mongodb";

export interface Users {
    _id: ObjectId;
    name: string;
    

}

export interface Jobs{
    _id:ObjectId
    name:string
    isCompleted:boolean
    isPending:boolean
    inProgress:boolean
    createdBy:ObjectId
}
interface pageInfo{
    totalCount:number
    lastPage:number|null
    nextPage:number|null
    totalPage:number
}
export interface pagiantedUser{
    users:Users[]
    pageInfo:pageInfo
}

export interface pagiantedJob{
    jobs:Jobs[]
    pageInfo:pageInfo
}
export interface Database {
    users: Collection<Users>;
    jobs:Collection<Jobs>;
}
