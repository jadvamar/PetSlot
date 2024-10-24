package com.PetSlot.PetSlot.Services.impl;


import com.PetSlot.PetSlot.DTO.BookedSlotDTO;
import com.PetSlot.PetSlot.Entity.BookedSlots;
import com.PetSlot.PetSlot.Repository.BookedSlotsRepository;
import jakarta.persistence.OptimisticLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookedSlotsService {
    @Autowired
    private BookedSlotsRepository bookedSlotsRepository;

    public List<BookedSlotDTO> getUserHistory(Long shopId){
        List<BookedSlots> bookedSlots = bookedSlotsRepository.findByUserId(shopId);
        List<BookedSlotDTO> bookedSlotDTOs  = new ArrayList<>();

        for(BookedSlots slot : bookedSlots){
            BookedSlotDTO dto = new BookedSlotDTO();
            dto.setDate(slot.getDate());
            dto.setStartTime(slot.getStartTime());
            dto.setEndTime(slot.getEndTime());

            // Get the email of the user associated with the booked slot
            if (slot.getShop() != null) {
                dto.setShopName(slot.getShop().getName()); // Make sure to set the email in your DTO
            }

            bookedSlotDTOs.add(dto);
        }
        return bookedSlotDTOs;
    }

    public boolean makeComplete(Long id){
        Optional<BookedSlots> bookedSlots = bookedSlotsRepository.findById(id);
        bookedSlots.get().setCompleted(2);
        return true;
    }

    public List<BookedSlotDTO> getHistory(Long shopId , LocalDate date){
        List<BookedSlots> bookedSlots = bookedSlotsRepository.findByShopIdAndDate(shopId, date);
        System.out.println("getting  slots----->>>>>>>>>"+shopId +" "+date) ;
        List<BookedSlotDTO> bookedSlotDTOs  = new ArrayList<>();

        for(BookedSlots slot : bookedSlots){
            BookedSlotDTO dto = new BookedSlotDTO();
            dto.setCompleted(slot.getCompleted());
            dto.setDate(slot.getDate());
            dto.setStartTime(slot.getStartTime());
            dto.setEndTime(slot.getEndTime());
            dto.setId(slot.getId());

            // Get the email of the user associated with the booked slot
            if (slot.getUser() != null) {
                dto.setUserEmail(slot.getUser().getEmail()); // Make sure to set the email in your DTO
            }

            bookedSlotDTOs.add(dto);
        }
        return bookedSlotDTOs;
    }

    public List<BookedSlotDTO> getUnavailableSlots(Long shopId, LocalDate date) {
        // Retrieve booked slots for the given shop and date
        List<BookedSlots> bookedSlots = bookedSlotsRepository.findByShopIdAndDate(shopId, date);


        // Map the booked slots to a list of TimeSlotDTOs (startTime, endTime)
        return bookedSlots.stream()
                .map(slot -> new BookedSlotDTO(slot.getStartTime(), slot.getEndTime()))
                .collect(Collectors.toList());
    }

    @Transactional
    public BookedSlots saveBookedSlot(BookedSlots bookedSlots) {
        Optional<BookedSlots> existingSlot = bookedSlotsRepository.findExistingSlot(
                bookedSlots.getShop().getId(),
                bookedSlots.getUser().getId(),
                bookedSlots.getDate(),
                bookedSlots.getStartTime(),
                bookedSlots.getEndTime()
        );

        if (existingSlot.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot already booked.");
        }

        try {
            return bookedSlotsRepository.save(bookedSlots);
        } catch (OptimisticLockException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot already booked. Please try again.");
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Database error.");
        }
    }


    private void validateBookedSlot(BookedSlots bookedSlots) {
        if (bookedSlots.getShop() == null || bookedSlots.getUser() == null ||
                bookedSlots.getStartTime() == null || bookedSlots.getEndTime() == null ||
                bookedSlots.getDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All fields must be provided.");
        }
        if (bookedSlots.getStartTime().isAfter(bookedSlots.getEndTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be before end time.");
        }
    }
}
