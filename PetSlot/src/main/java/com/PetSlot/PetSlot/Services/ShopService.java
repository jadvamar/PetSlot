package com.PetSlot.PetSlot.Services;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Time;
import java.util.List;

@Service
public interface ShopService {
    ResponseEntity<String> shopAdd(String name,
                                   String description,
                                   String address,
                                   String phone,
                                   Time start,
                                   Time end,
                                   Double lat,
                                   Double lag,
                                   String email,
                                   List<String> pets,
                                   List<String> services,
                                   List<MultipartFile> images);
}
