package com.StorySmith.Story_Smith.controller; // Update package to match yours

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows React frontend to talk to this endpoint
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("image") MultipartFile file) {
        Map<String, String> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("error", "No file uploaded");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            // Resolves '../uploads' relative to the execution root
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            File uploadFolder = uploadPath.toFile();

            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs(); // Automatically creates root/uploads if missing
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String uniqueFilename = "image-" + System.currentTimeMillis() + "-" 
                    + UUID.randomUUID().toString().substring(0, 8) + extension;

            Path destinationPath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), destinationPath);

            // Log exact path to backend console to verify physical location
            System.out.println("Saved file to: " + destinationPath.toString());

            String imageUrl = "/uploads/" + uniqueFilename;
            response.put("imageUrl", imageUrl);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            response.put("error", "Could not store file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // @DeleteMapping("/delete/{filename}")
    // public ResponseEntity<Map<String, String>> deleteFile(@PathVariable String filename) {
    //     Map<String, String> response = new HashMap<>();
    //     try {
    //         Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
    //         File fileToDelete = filePath.toFile();

    //         if (fileToDelete.exists()) {
    //             if (fileToDelete.delete()) {
    //                 response.put("message", "File deleted successfully");
    //                 return ResponseEntity.ok(response);
    //             } else {
    //                 response.put("error", "Failed to delete the file");
    //                 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    //             }
    //         } else {
    //             response.put("error", "File not found");
    //             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    //         }
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //         response.put("error", "Error occurred while deleting the file: " + e.getMessage());
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    //     }

    // }
}