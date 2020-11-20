import { User } from "./auth.provider";

const CACHE_KEY = "wanderlog_user";

export const cacheCurrentUser = (user:User) => {
    console.log("cacheCurrentUser -> user", JSON.stringify(user))
    localStorage.setItem(CACHE_KEY, JSON.stringify(user));
}

export const getCurrentUserFromCache = () : User => {
    try {
       return JSON.parse(localStorage.getItem(CACHE_KEY));
    } catch(err) {
        return null;
    }
}