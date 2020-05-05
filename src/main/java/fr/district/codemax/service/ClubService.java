package fr.district.codemax.service;

import fr.district.codemax.domain.Club;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link Club}.
 */
public interface ClubService {

    /**
     * Save a club.
     *
     * @param club the entity to save.
     * @return the persisted entity.
     */
    Club save(Club club);

    /**
     * Get all the clubs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Club> findAll(Pageable pageable);

    /**
     * Get all the clubs with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    Page<Club> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" club.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Club> findOne(Long id);

    /**
     * Delete the "id" club.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the club corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Club> search(String query, Pageable pageable);

	Page<Club> findByUserIsCurrentUser(Pageable pageable);

	Optional<Club> findByUser();
}
