import { defineStore } from "pinia";

export interface PhotoRecord {
  id: string;
  photoUrl: string;
  thumbnailUrl: string;
  typeId: string;
  typeName: string;
  size: string;
  backgroundColor: string;
  createTime: number;
  expireTime: number; // 7天后过期
}

export const useHistoryStore = defineStore("history", () => {
  // 历史记录
  const photoRecords = ref<PhotoRecord[]>([]);

  // 初始化加载历史记录
  const initHistory = () => {
    try {
      const storageData = uni.getStorageSync("photo_history");
      if (storageData) {
        photoRecords.value = JSON.parse(storageData);
        // 清理过期照片
        clearExpiredRecords();
      }
    } catch (e) {
      console.error("加载历史记录失败", e);
    }
  };

  // 保存照片到历史记录
  const savePhotoRecord = (record: Omit<PhotoRecord, "id" | "createTime" | "expireTime">) => {
    const now = Date.now();
    const newRecord: PhotoRecord = {
      ...record,
      id: now.toString(),
      createTime: now,
      expireTime: now + 7 * 24 * 60 * 60 * 1000, // 7天后过期
    };

    photoRecords.value = [newRecord, ...photoRecords.value];
    persistRecords();

    return newRecord;
  };

  // 删除历史记录
  const deletePhotoRecord = (id: string) => {
    photoRecords.value = photoRecords.value.filter((record) => record.id !== id);
    persistRecords();
  };

  // 清理过期记录
  const clearExpiredRecords = () => {
    const now = Date.now();
    const validRecords = photoRecords.value.filter((record) => record.expireTime > now);

    if (validRecords.length !== photoRecords.value.length) {
      photoRecords.value = validRecords;
      persistRecords();
    }
  };

  // 持久化记录到本地存储
  const persistRecords = () => {
    try {
      uni.setStorageSync("photo_history", JSON.stringify(photoRecords.value));
    } catch (e) {
      console.error("保存历史记录失败", e);
    }
  };

  return {
    photoRecords,
    initHistory,
    savePhotoRecord,
    deletePhotoRecord,
    clearExpiredRecords,
  };
});
