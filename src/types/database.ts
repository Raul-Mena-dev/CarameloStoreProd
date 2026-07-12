export type Category={id:string;name:string;slug:string;description:string|null;image_url:string|null;icon:string;is_active:boolean;sort_order:number};
export type Product={id:string;category_id:string|null;name:string;slug:string;description:string|null;sku:string|null;price:number;offer_price:number|null;offer_starts_at:string|null;offer_ends_at:string|null;stock:number|null;track_stock:boolean;image_url:string|null;is_active:boolean;is_featured:boolean;category?:Pick<Category,"name"|"slug">|null};
export type Banner={id:string;title:string;subtitle:string|null;image_url:string;button_text:string|null;button_url:string|null;starts_at:string|null;ends_at:string|null;is_active:boolean;sort_order:number};
export type OrderItem={product_id:string;quantity:number};
export type OrderStatus="new"|"contacted"|"confirmed"|"preparing"|"ready"|"completed"|"cancelled";
