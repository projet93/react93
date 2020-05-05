package fr.district.codemax.service;

import fr.district.codemax.domain.Stade;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link Stade}.
 */
public interface StadeService {

    /**
     * Save a stade.
     *
     * @param stade the entity to save.
     * @return the persisted entity.
     */
    Stade save(Stade stade);

    /**
     * Get all the stades.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Stade> findAll(Pageable pageable);

    /**
     * Get the "id" stade.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Stade> findOne(Long id);

    /**
     * Delete the "id" stade.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the stade corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Stade> search(String query, Pageable pageable);

	Page<Stade> findByUserIsCurrentUser(Pageable pageable);
}
