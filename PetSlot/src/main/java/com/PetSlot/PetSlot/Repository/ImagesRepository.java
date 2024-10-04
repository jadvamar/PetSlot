package com.PetSlot.PetSlot.Repository;

import com.PetSlot.PetSlot.Entity.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.*;
import java.util.List;

public interface ImagesRepository extends JpaRepository<Images,Integer> {
   // List<Images> findByUserEmail(@Param("email") String email);
   Images findFirstByShopId(Long shopId);
   @Query("SELECT img FROM Images img WHERE img.shop.id = :shopId")
   List<Images> findImagesByShopId(@Param("shopId") Long shopId);
}
