/*
 * @Author: moxunjinmu
 * @Date: 2025-04-02 21:12:34
 * @Description:
 */
export interface RemoveBackgroundOptions {
  image_file_b64?: string;
  size?: string; // 'auto' | '4k' | 'regular' | 'small' | 'hd' | '50MP'
  bg_color?: string; // 例如 'blue' 或 '#0000ff'
  type?: string; // 'auto' | 'person' | 'product' | 'car' | 'animal' | 'graphic' | 'transportation'
  type_level?: string; // 'none' | 'latest' | '1' | '2'
  format?: string; // 'auto' | 'png' | 'jpg' | 'zip'
  roi?: string; // x1,y1,x2,y2 格式的区域
  crop?: boolean; // 是否裁剪空白区域
  scale?: string; // '10%' | '50%' | '100%' 等比例
  position?: string; // 'center' | 'original'
  crop_margin?: string; // 裁剪边距
  semitransparency?: boolean; // 是否保留半透明
  shadow_type?: string; // 'drop_shadow' | 'reflection_shadow' | 'natural_shadow'
  shadow_opacity?: number; // 0.0 ~ 1.0
}

// API密钥
// export const API_KEY = "SoCbsU5JUMhDSr14nbAEc6t5";
export const API_KEY = "P9dP53GTCx8MK1KBNV4T1q5D";
