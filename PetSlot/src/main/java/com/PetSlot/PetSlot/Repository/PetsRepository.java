package com.PetSlot.PetSlot.Repository;

import com.PetSlot.PetSlot.Entity.Pets;
import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.util.List;

public interface PetsRepository extends JpaRepository<Pets,Integer> {
    @Query("SELECT p FROM Pets p WHERE p.shop.id = :shopId")
    List<Pets> findPetsByShopId(@Param("shopId") Long shopId);
}
