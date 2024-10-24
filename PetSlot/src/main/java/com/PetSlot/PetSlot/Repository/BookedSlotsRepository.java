package com.PetSlot.PetSlot.Repository;

import com.PetSlot.PetSlot.Entity.BookedSlots;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface BookedSlotsRepository extends JpaRepository<BookedSlots, Long> {

    @Query("SELECT bs FROM BookedSlots bs WHERE bs.shop.id = :shopId AND bs.date = :date")
    List<BookedSlots> findByShopIdAndDate(@Param("shopId") Long shopId, @Param("date") LocalDate date);

    @Query("SELECT bs FROM BookedSlots bs WHERE bs.user.id = :userId")
    List<BookedSlots> findByUserId(@Param("userId") Long userId);


    Optional<BookedSlots> findById(@Param("id") Long id);

    @Query("SELECT bs FROM BookedSlots bs WHERE bs.shop.id = :shopId AND bs.user.id = :userId AND bs.date = :date AND bs.startTime = :startTime AND bs.endTime = :endTime")
    Optional<BookedSlots> findExistingSlot(@Param("shopId") Long shopId,
                                           @Param("userId") Long userId,
                                           @Param("date") LocalDate date,
                                           @Param("startTime") LocalTime startTime,
                                           @Param("endTime") LocalTime endTime);
}
