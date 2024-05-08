export class User {
    name: string;
    slug: string;
    avatar: string;
    
    constructor(name: string, slug: string, avatar: string) {
        this.name = name;
        this.slug = slug;
        this.avatar = avatar;
    }
}