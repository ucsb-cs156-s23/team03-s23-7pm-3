package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Book;
import edu.ucsb.cs156.example.repositories.BookRepository;

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

@WebMvcTest(controllers = BooksController.class)
@Import(TestConfig.class)
public class BooksControllerTests extends ControllerTestCase {

        @MockBean
        BookRepository BookRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/Books/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/books/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/books/all"))
                                .andExpect(status().is(200)); // logged
        }
        
        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/books?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }
        
        // Authorization tests for /api/books/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/books/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/books/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // // Tests with mocks for database actions
        
        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                
                Book book = Book.builder()
                                .title("To Kill a Mockingbird")
                                .author("Harper Lee")
                                .description("It is a poignant coming-of-age story that confronts social issues and highlights the power of compassion and standing up for what is right")
                                .build();

                when(BookRepository.findById(eq(7L))).thenReturn(Optional.of(book));

                // act
                MvcResult response = mockMvc.perform(get("/api/books?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(BookRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(book);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(BookRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/books?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(BookRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Book with id 7 not found", json.get("message"));
        }
        
        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_books() throws Exception {

                // arrange
        

                Book book1 = Book.builder()
                                .title("To Kill a Mockingbird")
                                .author("Harper Lee")
                                .description("It is a poignant coming-of-age story that confronts social issues and highlights the power of compassion and standing up for what is right.")
                                .build();



                Book book2 = Book.builder()
                                .title("1984")
                                .author("George Orwell")
                                .description("Dystopian novel by George Orwell, set in a totalitarian society where Big Brother monitors citizens' every move.")
                                .build();

                ArrayList<Book> expectedBooks = new ArrayList<>();
                expectedBooks.addAll(Arrays.asList(book1, book2));

                when(BookRepository.findAll()).thenReturn(expectedBooks);

                // act
                MvcResult response = mockMvc.perform(get("/api/books/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(BookRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedBooks);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_book() throws Exception {


                Book book1 = Book.builder()
                                .title("To Kill a Mockingbird")
                                .author("Harper Lee")
                                .description("It is a poignant coming-of-age story that confronts social issues and highlights the power of compassion and standing up for what is right.")
                                .build();

                when(BookRepository.save(eq(book1))).thenReturn(book1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/books/post?title=To Kill a Mockingbird&author=Harper Lee&description=It is a poignant coming-of-age story that confronts social issues and highlights the power of compassion and standing up for what is right")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(BookRepository, times(1)).save(book1);
                String expectedJson = mapper.writeValueAsString(book1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_date() throws Exception {
                // arrange

                Book book1 = Book.builder()
                                .title("To Kill a Mockingbird")
                                .author("Harper Lee")
                                .description("It is a poignant coming-of-age story that confronts social issues and highlights the power of compassion and standing up for what is right.")
                                .build();

                when(BookRepository.findById(eq(15L))).thenReturn(Optional.of(book1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/books?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(BookRepository, times(1)).findById(15L);
                verify(BookRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("Book with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_book_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(BookRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/books?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(BookRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Book with id 15 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_book() throws Exception {
                // arrange

                Book bookOrig = Book.builder()
                                .title("To Kill a Mockingbird")
                                .author("Harper Lee")
                                .description("It is a poignant coming-of-age story that confronts social issues and highlights the power of compassion and standing up for what is right.")
                                .build();

                Book bookEdited = Book.builder()
                                .title("1984")
                                .author("George Orwell")
                                .description("Dystopian novel by George Orwell, set in a totalitarian society where Big Brother monitors citizens' every move.")
                                .build();

                String requestBody = mapper.writeValueAsString(bookEdited);

                when(BookRepository.findById(eq(67L))).thenReturn(Optional.of(bookOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/books?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(BookRepository, times(1)).findById(67L);
                verify(BookRepository, times(1)).save(bookEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_book_that_does_not_exist() throws Exception {
                // arrange

                Book  BookEditAuthor =  Book.builder()
                                .title("To Kill a Mockingbird")
                                .author("Jason")
                                .description("It is a poignant coming-of-age story that confronts social issues and highlights the power of compassion and standing up for what is right.")
                                .build();

                String requestBody = mapper.writeValueAsString(BookEditAuthor);

                when(BookRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/books?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(BookRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Book with id 67 not found", json.get("message"));

        }
        
}