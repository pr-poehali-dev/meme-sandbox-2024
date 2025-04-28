
export interface Meme {
  id: string;
  title: string;
  image: string;
  category: string;
  author: string;
  authorId?: string;
  createdAt: number;
  likes: number;
  description?: string;
  donations: number;
}

export interface Category {
  id: string;
  name: string;
  createdAt: number;
}

export interface Profile {
  id: string;
  username: string;
  avatar?: string;
  links: {
    telegram?: string;
    vk?: string;
    youtube?: string;
  };
  cardNumber?: string;
  createdAt: number;
}
