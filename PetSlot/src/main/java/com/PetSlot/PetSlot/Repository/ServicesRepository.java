package com.PetSlot.PetSlot.Repository;

import com.PetSlot.PetSlot.Entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@EnableJpaRepositories
@Repository
public interface ServicesRepository extends JpaRepository<Services,Integer> {
    //List<Services> findByUserEmail(@Param("email") String email);
    @Query("SELECT ser FROM Services ser WHERE ser.shop.id = :shopId")
    List<Services> findServicesByShopId(@Param("shopId") Long shopId);
}
