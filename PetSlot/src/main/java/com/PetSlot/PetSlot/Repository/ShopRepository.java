package com.PetSlot.PetSlot.Repository;

import com.PetSlot.PetSlot.DTO.ShopDTO;
import com.PetSlot.PetSlot.Entity.Shop;
import com.PetSlot.PetSlot.Entity.User;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.http.converter.json.GsonBuilderUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface ShopRepository extends JpaRepository <Shop,Integer>{

    Shop findByUserEmail(User user);
//    @Query("SELECT s FROM Shop s WHERE s.id = :shopId")
//    Optional<Shop> findById(@Param("shopId") Long shopId);
    Optional<Shop> findById(Long shopId);

    @Query("SELECT s FROM Shop s WHERE LOWER(s.address) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<Shop> findShopsByLocation(@Param("location") String location);

    @Query("SELECT s.id FROM Shop s WHERE s.user.id = :userId")
    Long findShopIdByUserId(@Param("userId") Long userId);

    @Query("SELECT new com.PetSlot.PetSlot.DTO.ShopDTO(s.id, s.name, s.description, s.address, s.phone, s.start, s.end, s.latitude, s.longitude, u.id) " +
            "FROM Shop s JOIN s.user u WHERE s.id = :id")
    Optional<ShopDTO> findBasicShopDetails(@Param("id") Long id);

}
