package fr.district.codemax.service;

import fr.district.codemax.domain.Categorie;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Categorie}.
 */
public interface CategorieService {

    /**
     * Save a categorie.
     *
     * @param categorie the entity to save.
     * @return the persisted entity.
     */
    Categorie save(Categorie categorie);

    /**
     * Get all the categories.
     *
     * @return the list of entities.
     */
    List<Categorie> findAll();


    /**
     * Get the "id" categorie.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Categorie> findOne(Long id);

    /**
     * Delete the "id" categorie.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the categorie corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @return the list of entities.
     */
    List<Categorie> search(String query);
    
    List<Categorie> findByUserIsCurrentUser();
}
