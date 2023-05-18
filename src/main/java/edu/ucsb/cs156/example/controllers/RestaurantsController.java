package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.Restaurant;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.RestaurantsRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;


@Api(description = "Restaurants")
@RequestMapping("/api/restaurants")
@RestController
@Slf4j
public class RestaurantsController extends ApiController {

    @Autowired
    RestaurantsRepository restaurantsRepository;

    @ApiOperation(value = "List all restaurants")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Restaurant> allRestaurants() {
        Iterable<Restaurant> restaurants = restaurantsRepository.findAll();
        return restaurants;
    }

    @ApiOperation(value = "Get a single restaurant")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Restaurant getById(
            @ApiParam("id") @RequestParam Long id) {
        Restaurant restaurants = restaurantsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Restaurant.class, id));

        return restaurants;
    }

    @ApiOperation(value = "Create a new restaurant")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public Restaurant postRestaurants(
        @ApiParam("name") @RequestParam String name,
        @ApiParam("address") @RequestParam String address,
        @ApiParam("specialty") @RequestParam String specialty
        )
        {

        Restaurant restaurants = new Restaurant();
        restaurants.setName(name);
        restaurants.setAddress(address);
        restaurants.setSpecialty(specialty);

        Restaurant savedRestaurants = restaurantsRepository.save(restaurants);

        return savedRestaurants;
    }

    @ApiOperation(value = "Delete a Restaurant")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteRestaurants(
            @ApiParam("id") @RequestParam Long id) {
        Restaurant restaurants = restaurantsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Restaurant.class, id));

        restaurantsRepository.delete(restaurants);
        return genericMessage("Restaurant with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single restaurant")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public Restaurant updateRestaurants(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid Restaurant incoming) {

        Restaurant restaurants = restaurantsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Restaurant.class, id));


        restaurants.setName(incoming.getName());
        restaurants.setAddress(incoming.getAddress());
        restaurants.setSpecialty(incoming.getSpecialty());

        restaurantsRepository.save(restaurants);

        return restaurants;
    }
}
