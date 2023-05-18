package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.IceCreamShop;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.IceCreamShopRepository;
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


@Api(description = "IceCreamShop")
@RequestMapping("/api/icecreamshop")
@RestController
@Slf4j
public class IceCreamShopController extends ApiController {

    @Autowired
    IceCreamShopRepository iceCreamShopRepository;

    @ApiOperation(value = "List all ice cream shops")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<IceCreamShop> allIceCreamShop() {
        Iterable<IceCreamShop> iceCreamShop = iceCreamShopRepository.findAll();
        return iceCreamShop;
    }

    @ApiOperation(value = "Get a single iceCreamShop")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public IceCreamShop getById(
            @ApiParam("id") @RequestParam Long id) {
        IceCreamShop iceCreamShop = iceCreamShopRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(IceCreamShop.class, id));

        return iceCreamShop;
    }

    @ApiOperation(value = "Create a new iceCreamShop")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public IceCreamShop postIceCreamShop(
        @ApiParam("name") @RequestParam String name,
        @ApiParam("address") @RequestParam String address,
        @ApiParam("description") @RequestParam String description
        )
        {

        IceCreamShop iceCreamShop = new IceCreamShop();
        iceCreamShop.setName(name);
        iceCreamShop.setAddress(address);
        iceCreamShop.setDescription(description);

        IceCreamShop savedIceCreamShop = iceCreamShopRepository.save(iceCreamShop);

        return savedIceCreamShop;
    }

    @ApiOperation(value = "Delete a IceCreamShop")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteIceCreamShop(
            @ApiParam("id") @RequestParam Long id) {
        IceCreamShop iceCreamShop = iceCreamShopRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(IceCreamShop.class, id));

        iceCreamShopRepository.delete(iceCreamShop);
        return genericMessage("IceCreamShop with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single iceCreamShop")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public IceCreamShop updateCommons(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid IceCreamShop incoming) {

        IceCreamShop iceCreamShop = iceCreamShopRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(IceCreamShop.class, id));


        iceCreamShop.setName(incoming.getName());  
        iceCreamShop.setAddress(incoming.getAddress());
        iceCreamShop.setDescription(incoming.getDescription());


        iceCreamShopRepository.save(iceCreamShop);

        return iceCreamShop;
    }
}