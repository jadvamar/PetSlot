package com.PetSlot.PetSlot.Services.impl;

import com.PetSlot.PetSlot.Entity.Shop;
import com.PetSlot.PetSlot.Entity.User;
import com.PetSlot.PetSlot.Entity.Services;
import com.PetSlot.PetSlot.Entity.Pets;
import com.PetSlot.PetSlot.Entity.Images;
import com.PetSlot.PetSlot.Repository.ShopRepository;
import com.PetSlot.PetSlot.Services.ShopService;
import com.PetSlot.PetSlot.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShopServiceImpl implements ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private UserRepository userRepository; // Add user repository here

    @Override
    @Transactional
    public ResponseEntity<String> shopAdd(String name,
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
                                           List<MultipartFile> images) {
        // Assuming you have a User entity corresponding to the email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Shop shop = new Shop();
        shop.setName(name);
        shop.setDescription(description);
        shop.setAddress(address);
        shop.setPhone(phone);
        shop.setStart(start);
        shop.setEnd(end);
        shop.setLatitude(lat);
        shop.setLongitude(lag);
        shop.setUser(user);

        // Handle services
        List<Services> serviceList = new ArrayList<>();
        for (String serviceName : services) {
            Services service = new Services();
            service.setName(serviceName);
            service.setShop(shop); // Set the shop reference
            serviceList.add(service);
        }
        shop.setServices(serviceList);

        // Handle pets
        List<Pets> petsList = new ArrayList<>();
        for (String petNames : pets) {
            Pets pet = new Pets();
            pet.setName(petNames);
            pet.setShop(shop); // Set the shop reference
            petsList.add(pet);
        }
        shop.setPets(petsList);

        // Handle images
        List<Images> imageList = new ArrayList<>();
        for (MultipartFile imageFile : images) {
            try {
                Images image = new Images();
                image.setImage(imageFile.getBytes());
                image.setShop(shop); // Set the shop reference
                imageList.add(image);
            } catch (IOException e) {
                return ResponseEntity.badRequest().body("Failed to upload images");
            }
        }
        shop.setImages(imageList);

        // Save the shop entity
        shopRepository.save(shop);
        return ResponseEntity.ok("Shop added successfully!");
    }
}
