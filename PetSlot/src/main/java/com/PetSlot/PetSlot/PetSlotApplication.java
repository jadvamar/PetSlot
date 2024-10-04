package com.PetSlot.PetSlot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"com.PetSlot.PetSlot.Entity"})
public class PetSlotApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetSlotApplication.class, args);
	}

}
