package com.StorySmith.Story_Smith.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@ConditionalOnProperty(
    name = "storage.type",
    havingValue = "local",
    matchIfMissing = true
)
public class LocalStorageService implements FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String uploadFile(MultipartFile file) throws IOException {

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        File folder = uploadPath.toFile();

        if (!folder.exists()) {
            folder.mkdirs();
        }

        String original = file.getOriginalFilename();

        String extension = "";

        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf("."));
        }

        String filename =
                "image-"
                + System.currentTimeMillis()
                + "-"
                + UUID.randomUUID().toString().substring(0,8)
                + extension;

        Files.copy(
                file.getInputStream(),
                uploadPath.resolve(filename)
        );

        return "/uploads/" + filename;
    }
}