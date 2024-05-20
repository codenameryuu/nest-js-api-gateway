import { Injectable } from "@nestjs/common";
import { writeFile, existsSync, unlinkSync } from "fs";
import { DateTime } from "luxon";

@Injectable()
export class FileHelper {
  async isValidImage(file: any): Promise<boolean> {
    const ext = file.fileType.ext;
    const allowedType = ["jpg", "jpeg", "png"];

    if (allowedType.includes(ext)) {
      return true;
    }

    return false;
  }

  async saveFile(file: any): Promise<string> {
    const ext = file.fileType.ext;
    const now = DateTime.now().toFormat("yyyyLLdd");
    const random = Math.random().toString(36).slice(2, 17);
    const filename = now + random + "." + ext;

    const base64Image = Buffer.from(file.buffer).toString("base64");
    writeFile("src/uploads/" + filename, base64Image, { encoding: "base64" }, function (err) {});

    return filename;
  }

  async deleteFile(file: string): Promise<void> {
    const path = "src/uploads/" + file;

    if (existsSync(path)) {
      unlinkSync(path);
    }
  }
}
