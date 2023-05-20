package edu.ucsb.cs156.example.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.IceCreamShop;
import edu.ucsb.cs156.example.repositories.IceCreamShopRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@WebMvcTest(controllers = IceCreamShopController.class)
@Import(TestConfig.class)
public class IceCreamShopControllerTests extends ControllerTestCase {

        @MockBean
        IceCreamShopRepository iceCreamShopRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/icecreamshop/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/icecreamshop/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/icecreamshop/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/icecreamshop?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/icecreamshop/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/icecreamshop/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/icecreamshop/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                IceCreamShop iceCreamShop = IceCreamShop.builder()
                                .name("IVDrip")
                                .address("EmbarcaderodelNorteIslaVistaCA")
                                .description("Quaintcompactcafeservinglocallyroastedcoffeealongsidehousemadebakedtreatsicecream")
                                .build();

                when(iceCreamShopRepository.findById(eq(7L))).thenReturn(Optional.of(iceCreamShop));

                // act
                MvcResult response = mockMvc.perform(get("/api/icecreamshop?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(iceCreamShopRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(iceCreamShop);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(iceCreamShopRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/icecreamshop?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(iceCreamShopRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("IceCreamShop with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_icecreamshop() throws Exception {

                // arrange

                IceCreamShop ivdrip = IceCreamShop.builder()
                                .name("IVDrip")
                                .address("EmbarcaderodelNorteIslaVistaCA")
                                .description("Quaintcompactcafeservinglocallyroastedcoffeealongsidehousemadebakedtreatsicecream")
                                .build();

                IceCreamShop yogurtland = IceCreamShop.builder()
                                .name("Yogurtland")
                                .address("CalleRealGoletaCA")
                                .description("Outpostofalocalchainofferingselfservefrozenyogurttoppingsinacontemporaryspace")
                                .build();

                ArrayList<IceCreamShop> expectedIceCreamShops = new ArrayList<>();
                expectedIceCreamShops.addAll(Arrays.asList(ivdrip, yogurtland));

                when(iceCreamShopRepository.findAll()).thenReturn(expectedIceCreamShops);

                // act
                MvcResult response = mockMvc.perform(get("/api/icecreamshop/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(iceCreamShopRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedIceCreamShops);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_iceCreamShop() throws Exception {
                // arrange

                IceCreamShop iceCreamShop1 = IceCreamShop.builder()
                                .name("Yogurtland")
                                .address("CalleRealGoletaCA")
                                .description("Outpostofalocalchainofferingselfservefrozenyogurttoppingsinacontemporaryspace")
                                .build();

                when(iceCreamShopRepository.save(eq(iceCreamShop1))).thenReturn(iceCreamShop1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/icecreamshop/post?name=Yogurtland&address=CalleRealGoletaCA&description=Outpostofalocalchainofferingselfservefrozenyogurttoppingsinacontemporaryspace")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(iceCreamShopRepository, times(1)).save(iceCreamShop1);
                String expectedJson = mapper.writeValueAsString(iceCreamShop1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_iceCreamShop() throws Exception {
                // arrange

                IceCreamShop baskinrobbins = IceCreamShop.builder()
                                .name("BaskinRobbins")
                                .address("StateStSantaBarbaraCA")
                                .description("Colorfulicecreamparlorchainknownforitsmanyflavorsplussorbetyogurt")
                                .build();

                when(iceCreamShopRepository.findById(eq(15L))).thenReturn(Optional.of(baskinrobbins));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/icecreamshop?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(iceCreamShopRepository, times(1)).findById(15L);
                verify(iceCreamShopRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("IceCreamShop with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_iceCreamShop_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(iceCreamShopRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/icecreamshop?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(iceCreamShopRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("IceCreamShop with id 15 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_iceCreamShop() throws Exception {
                // arrange

                IceCreamShop ivdripOrig = IceCreamShop.builder()
                                .name("IVDrip")
                                .address("EmbarcaderodelNorteIslaVistaCA")
                                .description("Quaintcompactcafeservinglocallyroastedcoffeealongsidehousemadebakedtreatsicecream")
                                .build();

                IceCreamShop ivdripEdited = IceCreamShop.builder()
                                .name("ivdrip")
                                .address("EmbarcaderodelNorteGoletaCA")
                                .description("Quaintcompactcafe")
                                .build();

                String requestBody = mapper.writeValueAsString(ivdripEdited);

                when(iceCreamShopRepository.findById(eq(67L))).thenReturn(Optional.of(ivdripOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/icecreamshop?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(iceCreamShopRepository, times(1)).findById(67L);
                verify(iceCreamShopRepository, times(1)).save(ivdripEdited); // should be saved with updated info
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_iceCreamShop_that_does_not_exist() throws Exception {
                // arrange

                IceCreamShop editedIceCreamShop = IceCreamShop.builder()
                                .name("ivdrip")
                                .address("EmbarcaderodelNorteGoletaCA")
                                .description("Quaintcompactcafeservinglocallyroastedcoffeealongsidehousemadebakedtreatsicecream")
                                .build();

                String requestBody = mapper.writeValueAsString(editedIceCreamShop);

                when(iceCreamShopRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/icecreamshop?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(iceCreamShopRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("IceCreamShop with id 67 not found", json.get("message"));

        }
}
