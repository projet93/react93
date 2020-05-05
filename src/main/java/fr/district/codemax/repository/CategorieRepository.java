package fr.district.codemax.repository;

import fr.district.codemax.domain.Categorie;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Categorie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {

//    @Query("select categorie from Categorie categorie where categorie.user.login = ?#{principal.username}")
//    List<Categorie> findByUserIsCurrentUser();
    
    @Query("select club.categories from Club club where club.user.login = ?#{principal.username}")
    List<Categorie> findByUserIsCurrentUser();
}
