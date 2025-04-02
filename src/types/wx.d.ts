/// <reference types="@dcloudio/types" />

declare namespace WechatMiniprogram {
  interface FileSystemManager {
    readFile(options: {
      filePath: string;
      success?: (res: { data: ArrayBuffer }) => void;
      fail?: (err: any) => void;
    }): void;
    writeFile(options: {
      filePath: string;
      data: ArrayBuffer;
      encoding?: string;
      success?: () => void;
      fail?: (err: any) => void;
    }): void;
    mkdirSync(dirPath: string, recursive: boolean): void;
  }
}

declare const wx: {
  getFileSystemManager(): WechatMiniprogram.FileSystemManager;
  env: {
    USER_DATA_PATH: string;
    [key: string]: any;
  };
};
