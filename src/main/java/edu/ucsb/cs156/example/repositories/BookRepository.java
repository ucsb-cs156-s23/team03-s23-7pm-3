package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.Book;
import edu.ucsb.cs156.example.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends CrudRepository<Book, Long> {

}