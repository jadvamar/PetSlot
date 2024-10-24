package com.PetSlot.PetSlot.Repository;

import com.PetSlot.PetSlot.Entity.Pets;
import com.PetSlot.PetSlot.Entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@EnableJpaRepositories
@Repository
public interface RatingRepository extends JpaRepository<Rating,Long> {

    @Query("SELECT r FROM Rating r WHERE r.shop.id = :shopId")
    List<Rating> findByShopId(@Param("shopId") Long shopId);
}
