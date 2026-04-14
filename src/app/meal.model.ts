export interface Meal {
  name: string;
  thumbnail: string;
  category: string;
  country: string;
  instructions: string;
  youtube: string;
}

export interface ApiResponse {
  success: boolean;
  data: Meal[]; // لأن البحث بيرجع مصفوفة (Array) من الوجبات
}