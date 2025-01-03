package com.PetSlot.PetSlot.Controller;

import com.PetSlot.PetSlot.DTO.*;
import com.PetSlot.PetSlot.Entity.*;
import com.PetSlot.PetSlot.Repository.*;
import com.PetSlot.PetSlot.Security.JwtHelper;
import com.PetSlot.PetSlot.Services.ShopService;
import com.PetSlot.PetSlot.Services.UserService;
import com.PetSlot.PetSlot.Services.impl.BookedSlotsService;
import com.PetSlot.PetSlot.Services.impl.CustomerDetails;
import java.sql.Time;

import com.PetSlot.PetSlot.Services.impl.RatingService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("api/v1/user")
public class UserController {

    @Autowired
    public UserController(UserService userService, JwtHelper helper) {
        this.userService = userService;
        this.helper = helper;
    }


    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    ShopService shopService;

    @Autowired
    private final JwtHelper helper;

    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private final UserService userService;

    @Autowired
    private BookedSlotsRepository bookedSlotsRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private ImagesRepository imageRepository;
    @Autowired
    private BookedSlotsService bookedSlotsService;
    @Autowired
    private ServicesRepository servicesRepository;
    @Autowired
    private PetsRepository petsRepository;
    @Autowired
    private RatingService ratingService;

    @PostMapping(path = "/signup")
    public ResponseEntity<String> signupUser(@RequestBody UserDTO userDTO) {
        logger.info("Signup request received for email: {}", userDTO.getEmail());
        String response = userService.signupUser(userDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @PostMapping("/google-signup")
    public ResponseEntity<?> googleSignup(@RequestBody GoogleTokenRequestDTO tokenRequest) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                    .setAudience(Collections.singletonList("51593724276-h3djp2kbqho92b1en6jhov0v2glgni24.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenRequest.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String role = tokenRequest.getRole(); // Extract the role from the request

                // Create a new user or retrieve existing user by email, including the role
                User user = userService.registerGoogleUser(email, name, role); // Pass the role to the user registration method
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                // Generate JWT token
                String jwtToken = helper.generateToken(userDetails);
                JwtResponseDTO response = JwtResponseDTO.builder()
                        .token(jwtToken)
                        .username(userDetails.getUsername()).build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google signup failed.");
        }
    }



    @PostMapping(path = "/rating")
    public ResponseEntity<?> addRating(@RequestBody RatingDTO ratingDTO){
        try {
            Rating savedRating = ratingService.saveRating(ratingDTO);
            return new ResponseEntity<>(savedRating, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to save rating: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping(path="/getRating")
    public ResponseEntity<?> getRating(@RequestParam Long shopId){
        try{
            List<RatingDTO> ratingDTO = ratingService.getRating(shopId);
            System.out.println(ratingDTO);
            return new ResponseEntity<>(ratingDTO,HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>("Failed to fetch rating: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @PostMapping("/book-slot")
    public ResponseEntity<?> bookSlot(@RequestBody BookedSlotDTO bookedSlotDTO) {
        try {
            // Log the received bookedSlots
            System.out.println("Received booking request: " + bookedSlotDTO);

            Optional<Shop> shop = shopRepository.findById(bookedSlotDTO.getShop());
            Optional<User> user = userRepository.findById(bookedSlotDTO.getUser());

            // Check if shop and user exist
            if (shop.isEmpty()) {
                return new ResponseEntity<>("Shop not found", HttpStatus.NOT_FOUND);
            }
            if (user.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }


            BookedSlots bookedSlots = new BookedSlots();
            bookedSlots.setUser(user.get());
            bookedSlots.setShop(shop.get());
            bookedSlots.setStartTime(bookedSlotDTO.getStartTime());
            bookedSlots.setEndTime(bookedSlotDTO.getEndTime());
            bookedSlots.setDate(bookedSlotDTO.getDate());
            bookedSlots.setCompleted(1);
            //System.out.println("Bookslot"+bookedSlots);
            System.out.println("working till this");

            //System.out.println(bookedSlots);
            BookedSlots savedSlot = bookedSlotsService.saveBookedSlot(bookedSlots);
            System.out.println("working till this1");
            return new ResponseEntity<>(savedSlot, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error booking slot: " + e.getMessage());
            return new ResponseEntity<>("Error occurred while booking the slot: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/{shopId}/unavailable-slots")
    public ResponseEntity<List<BookedSlotDTO>> getUnavailableBoxes(
            @PathVariable Long shopId,
            @RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date); // Convert the date string to LocalDate
        List<BookedSlotDTO> unavailableSlots = bookedSlotsService.getUnavailableSlots(shopId, localDate);
        return ResponseEntity.ok(unavailableSlots);
    }

    @PostMapping("/makeComplete")
    public ResponseEntity<?> makeComplete(@RequestParam Long id) {
        Optional<BookedSlots> bookedSlot = bookedSlotsRepository.findById(id);

        if (bookedSlot.isPresent()) {
            bookedSlot.get().setCompleted(2); // Set completed to 2 (Completed status)
            bookedSlotsRepository.save(bookedSlot.get()); // Save the updated entity
            return ResponseEntity.ok("Slot marked as complete");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Slot not found");
        }
    }

    @GetMapping("/getBookings")
    public ResponseEntity<List<BookedSlotDTO>> getCompanyHistory(@RequestParam Long userid,@RequestParam String date){
        Long shopId = shopRepository.findShopIdByUserId(userid);
        System.out.println("shop id --------------->" + shopId);
        if (shopId == null) {
            return ResponseEntity.notFound().build(); // Return 404 if no shop found
        }
        LocalDate localDate = LocalDate.parse(date);
        List<BookedSlotDTO> bookedSlots = bookedSlotsService.getHistory(shopId, localDate);
        System.out.println("working--------------->" + bookedSlots);
        return ResponseEntity.ok(bookedSlots);
    }
    @GetMapping("/getHistory")
    public ResponseEntity<List<BookedSlotDTO>> getUserHistory(@RequestParam Long userid){
        List<BookedSlotDTO> bookedSlots = bookedSlotsService.getUserHistory(userid);
        System.out.println("working--------------->" + bookedSlots);
        return ResponseEntity.ok(bookedSlots);
    }


    @PostMapping(path = "/Shop", consumes = "multipart/form-data")
    public ResponseEntity<String> addShops(@RequestParam("companyName") String name,
                                           @RequestParam("description") String description,
                                           @RequestParam("address") String address,
                                           @RequestParam("phoneNumber") String phone,
                                           @RequestParam("openTime") String openTime,  // Change Time to String
                                           @RequestParam("endTime") String endTime,    // Change Time to String
                                           @RequestParam("latitude") Double lat,
                                           @RequestParam("longitude") Double lag,
                                           @RequestParam("email") String email,
                                           @RequestParam(value = "selectedServiceTypes[]") List<String> pets,
                                           @RequestParam(value = "selectedServices[]") List<String> services,
                                           @RequestParam(value = "photos") List<MultipartFile> images) {
        try {
            // Convert String to java.sql.Time
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
            Time startTime = new Time(timeFormat.parse(openTime).getTime());
            Time endTimeParsed = new Time(timeFormat.parse(endTime).getTime());

            // Pass the parsed times to the service
            return shopService.shopAdd(name, description, address, phone, startTime, endTimeParsed, lat, lag, email, pets, services, images);

        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Invalid time format");
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleTokenRequestDTO tokenRequest) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                    .setAudience(Collections.singletonList("51593724276-mrejr24evg2oqgnt7cjl64lr4djpb0a7.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenRequest.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                User user = userService.isVailable(email);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                if (user != null) {
                    String jwtToken = helper.generateToken(userDetails);
                    JwtResponseDTO response = JwtResponseDTO.builder()
                            .token(jwtToken)
                            .username(userDetails.getUsername()).build();
                    return new ResponseEntity<>(response, HttpStatus.OK);
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google login failed.");
        }
    }
    

    @PostMapping(path = "/login")
    public ResponseEntity<JwtResponseDTO> loginEmployee(@RequestBody JwtRequestDTO request) {

        this.doAuthenticate(request.getEmail(), request.getPassword());


        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = this.helper.generateToken(userDetails);

        JwtResponseDTO response = JwtResponseDTO.builder()
                .token(token)
                .username(userDetails.getUsername()).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    private void doAuthenticate(String email, String password) {

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
        try {
            manager.authenticate(authentication);


        } catch (BadCredentialsException e) {
            throw new BadCredentialsException(" Invalid Username or Password  !!");
        }

    }
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String username;

            try {
                // Extract username from token
                username = helper.getUsernameFromToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (helper.validateToken(token, userDetails)) {
                    Map<String,String> responce = new HashMap<>();
                    responce.put("email" ,userDetails.getUsername());
                    responce.put("role",((CustomerDetails)userDetails).getRole());
                    responce.put("id",((CustomerDetails)userDetails).getId());
                    return ResponseEntity.ok(responce); // You can return more user data if needed
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization header missing or malformed");
        }
    }
    @GetMapping("/GetShops")
    public ResponseEntity<?> getShops(@RequestParam String location) {
        if (location == null || location.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Location must not be null or empty");
        }

        logger.info("Fetching shops for location: {}", location);
        List<Shop> shops = shopRepository.findShopsByLocation(location);
        if (shops.isEmpty()) {
            logger.info("No shops found for location: {}", location);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No shops found for the given location");
        }

        List<ShopDTO> response = new ArrayList<>();
        for (Shop shop : shops) {
            ShopDTO dto = new ShopDTO();
            dto.setId(shop.getId());
            dto.setName(shop.getName());
            dto.setDescription(shop.getDescription());
            dto.setAddress(shop.getAddress());
            dto.setPhone(shop.getPhone());

            Images photo = imageRepository.findFirstByShopId(shop.getId());
            if (photo != null) {
                dto.setPhoto(photo.getImage());
                System.out.println("working");
            }

            response.add(dto);
        }
        System.out.println("response");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/openShop")
    public ResponseEntity<?> getShop(@RequestParam String id) {
        Long shopId = Long.parseLong(id);

        Optional<ShopDTO> shopOptional = shopRepository.findBasicShopDetails(shopId);
        if (shopOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No shop found for the given ID");
        }

        ShopDTO shopDTO = shopOptional.get();

        // Fetch pets, services, and images separately
        List<Pets> pets = petsRepository.findPetsByShopId(shopId);
        List<Services> services = servicesRepository.findServicesByShopId(shopId);
        List<Images> images = imageRepository.findImagesByShopId(shopId);

        // Convert pets to List<String> containing only the names
        List<String> petNames = pets.stream()
                .map(Pets::getName) // Assuming Pets has a method getName()
                .collect(Collectors.toList());

        // Convert services to List<String> containing only the names
        List<String> serviceNames = services.stream()
                .map(Services::getName) // Assuming Services has a method getName()
                .collect(Collectors.toList());

        // Convert images to List<byte[]> containing the photo bytes
        List<byte[]> imageBytes = images.stream()
                .map(Images::getImage) // Assuming Images has a method getPhoto()
                .collect(Collectors.toList());

        // Set the transformed data into the ShopDTO
        shopDTO.setPets(petNames);
        shopDTO.setServices(serviceNames);
        shopDTO.setImages(imageBytes);

        // Fetch the first image for the photo field
        Images photo = imageRepository.findFirstByShopId(shopId);
        if (photo != null) {
            shopDTO.setPhoto(photo.getImage());
        }

        return ResponseEntity.ok(shopDTO);
    }



    @GetMapping("/getHeaderImage")
    public ResponseEntity<?> getHeaderImage(@RequestParam String id) {
        Long shopId = Long.parseLong(id);
        System.out.println("id1" + id);

        logger.info("Fetching shop for id: {}", id);
        System.out.println("id" + id);

        Optional<Shop> shopOptional = shopRepository.findById(shopId);

        if (shopOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No shops found for the given ID");
        }
        System.out.println("function call");

        // Retrieve the Shop from Optional if present
        Shop shop = shopOptional.get();
        ShopDTO shopDTO = new ShopDTO();

        shopDTO.setId(shop.getId());

        Images photo = imageRepository.findFirstByShopId(shop.getId());
        if (photo != null) {
            shopDTO.setPhoto(photo.getImage());
            System.out.println("working");
        }
        //shopDTO.setUser(shop.getUser().getEmail()); // Assuming you want the user's email

        // Assuming the photo is associated with the shop in some way
        // If shop has a field for photo, set it here
//        logger.info("Returning shop data: {}", shopDTO);
        return ResponseEntity.ok(shopDTO);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid !!";
    }
}