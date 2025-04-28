
export interface Meme {
  id: string;
  title: string;
  image: string;
  category: string;
  author: string;
  createdAt: number;
  likes: number;
}

export interface Category {
  id: string;
  name: string;
  createdAt: number;
}
