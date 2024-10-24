package com.PetSlot.PetSlot.Services.impl;

import com.PetSlot.PetSlot.DTO.RatingDTO;
import com.PetSlot.PetSlot.Entity.Rating;
import com.PetSlot.PetSlot.Entity.Shop;
import com.PetSlot.PetSlot.Entity.User;
import com.PetSlot.PetSlot.Repository.RatingRepository;
import com.PetSlot.PetSlot.Repository.ShopRepository;
import com.PetSlot.PetSlot.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.json.GsonBuilderUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private UserRepository userRepository;

    public List<RatingDTO> getRating(Long shopId) {
        List<Rating> ratings = ratingRepository.findByShopId(shopId);
        List<RatingDTO> ratingDTOs = new ArrayList<RatingDTO>();

        // Use a traditional for loop to manually map Rating entities to RatingDTOs
        for (Rating rating : ratings) {
            User user = rating.getUser(); // Get the User entity
            Shop shop = rating.getShop(); // Get the Shop entity
            System.out.println(user.getName() + " "+shop.getName()+" "+rating.getComment() + " "+ rating.getRate());
            // Create a RatingDTO with user's name and other details
            RatingDTO ratingDTO = new RatingDTO(

                    rating.getId(),
                    user.getName(), // user name
                    rating.getRate(),
                    rating.getComment()
            );
            System.out.println(ratingDTO);

            ratingDTOs.add(ratingDTO); // Add the RatingDTO to the list
        }

        return ratingDTOs; // Return the list of RatingDTOs
    }



    public Rating saveRating(RatingDTO ratingInput) throws IllegalArgumentException {
        System.out.println("Rating input received: " + ratingInput);

        System.out.println(ratingInput.getShopId().getClass().getName());
        Long shopId = ratingInput.getShopId();
        System.out.println(shopId);
        if (ratingInput.getShopId() == null || ratingInput.getUserId() == null) {
            throw new IllegalArgumentException("Shop ID or User ID cannot be null.");
        }

        Optional<Shop> optionalShop = shopRepository.findById(shopId);
        // Fetch user by userId
        Long userId = ratingInput.getUserId();
        Optional<User> optionalUser = userRepository.findById(userId);

        // Validate shop and user existence
        if (optionalShop.isEmpty()) {
            throw new IllegalArgumentException("Shop with ID " + ratingInput.getShopId() + " not found.");
        }
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + ratingInput.getUserId() + " not found.");
        }


        // Create and populate Rating entity
        Rating rating = new Rating();
        rating.setShop(optionalShop.get());
        rating.setUser(optionalUser.get());
        rating.setRate(ratingInput.getRate());
        rating.setComment(ratingInput.getComment());

        // Save and return the Rating entity
        return ratingRepository.save(rating);
    }

}
