package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Restaurant;
import edu.ucsb.cs156.example.repositories.RestaurantsRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = RestaurantsController.class)
@Import(TestConfig.class)
public class RestaurantsControllerTests extends ControllerTestCase {

        @MockBean
        RestaurantsRepository restaurantsRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/restaurants/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/restaurants/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/restaurants/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/restaurants?id=1"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/restaurants/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/restaurants/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/restaurants/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                Restaurant restaurant = Restaurant.builder()
                                .name("KazuNori: The Original Hand Roll Bar")
                                .address("1110 Gayley Ave, Los Angeles, CA 90024")
                                .specialty("Sushi - Hand Rolls")
                                .build();

                when(restaurantsRepository.findById(eq(1l))).thenReturn(Optional.of(restaurant));

                // act
                MvcResult response = mockMvc.perform(get("/api/restaurants?id=1"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(restaurantsRepository, times(1)).findById(eq(1l));
                String expectedJson = mapper.writeValueAsString(restaurant);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(restaurantsRepository.findById(eq(23l))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/restaurants?id=23"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(restaurantsRepository, times(1)).findById(eq(23l));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Restaurant with id 23 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_restaurants() throws Exception {

                // arrange

                Restaurant kazunori = Restaurant.builder()
                                .name("KazuNori: The Original Hand Roll Bar")
                                .address("1110 Gayley Ave, Los Angeles, CA 90024")
                                .specialty("Sushi - Hand Rolls")
                                .build();

                Restaurant sun = Restaurant.builder()
                                .name("Sun Sushi")
                                .address("3631 State St, Santa Barbara, CA 93105")
                                .specialty("Sushi")
                                .build();

                ArrayList<Restaurant> expectedRestaurants = new ArrayList<>();
                expectedRestaurants.addAll(Arrays.asList(kazunori, sun));

                when(restaurantsRepository.findAll()).thenReturn(expectedRestaurants);

                // act
                MvcResult response = mockMvc.perform(get("/api/restaurants/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(restaurantsRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedRestaurants);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_restaurant() throws Exception {
                // arrange

                Restaurant sun = Restaurant.builder()
                                .name("Sun Sushi")
                                .address("3631 State St, Santa Barbara, CA 93105")
                                .specialty("Sushi")
                                .build();

                when(restaurantsRepository.save(eq(sun))).thenReturn(sun);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/restaurants/post?name=Sun Sushi&address=3631 State St, Santa Barbara, CA 93105&specialty=Sushi")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).save(sun);
                String expectedJson = mapper.writeValueAsString(sun);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_restaurant() throws Exception {
                // arrange

                Restaurant kazunori = Restaurant.builder()
                                .name("KazuNori: The Original Hand Roll Bar")
                                .address("1110 Gayley Ave, Los Angeles, CA 90024")
                                .specialty("Sushi - Hand Rolls")
                                .build();

                when(restaurantsRepository.findById(eq(1l))).thenReturn(Optional.of(kazunori));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/restaurants?id=1")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).findById(1l);
                verify(restaurantsRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("Restaurant with id 1 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_restaurant_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(restaurantsRepository.findById(eq(123l))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/restaurants?id=123")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).findById(123l);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Restaurant with id 123 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_restaurant() throws Exception {
                // arrange

                Restaurant kazunoriOrig = Restaurant.builder()
                                .name("KazuNori: The Original Hand Roll Bar")
                                .address("1110 Gayley Ave, Goleta, CA 90024")
                                .specialty("Burgers")
                                .build();

                Restaurant kazunoriEdited = Restaurant.builder()
                                .name("KazuNori")
                                .address("1110 Gayley Ave, Los Angeles, CA 90024")
                                .specialty("Sushi - Hand Rolls")
                                .build();

                String requestBody = mapper.writeValueAsString(kazunoriEdited);

                when(restaurantsRepository.findById(eq(2l))).thenReturn(Optional.of(kazunoriOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/restaurants?id=2")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).findById(2l);
                verify(restaurantsRepository, times(1)).save(kazunoriEdited); // should be saved with updated info
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_commons_that_does_not_exist() throws Exception {
                // arrange

                Restaurant kazunoriEdited = Restaurant.builder()
                                .name("KazuNori")
                                .address("1110 Gayley Ave, Los Angeles, CA 90024")
                                .specialty("Sushi - Hand Rolls")
                                .build();

                String requestBody = mapper.writeValueAsString(kazunoriEdited);

                when(restaurantsRepository.findById(eq(2l))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/restaurants?id=2")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).findById(2l);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Restaurant with id 2 not found", json.get("message"));

        }
}
