package fr.district.codemax.service;

import fr.district.codemax.domain.Inscription;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Inscription}.
 */
public interface InscriptionService {

    /**
     * Save a inscription.
     *
     * @param inscription the entity to save.
     * @return the persisted entity.
     */
    Inscription save(Inscription inscription);
    
    /**
     * Save a inscription.
     *
     * @param inscription the entity to save.
     * @return void.
     */
    void saveInit(Inscription inscription);
    
    /**
     * Update a inscription.
     *
     * @param inscription the entity to update.
     * @return the persisted entity.
     */
    Inscription update(Inscription inscription);

    /**
     * Get all the inscriptions.
     *
     * @return the list of entities.
     */
    List<Inscription> findAll();

    /**
     * Get the "id" inscription.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Inscription> findOne(Long id);

    /**
     * Delete the "id" inscription.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the inscription corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @return the list of entities.
     */
    List<Inscription> search(String query);

    /**
     * 
     * @param id
     * @return
     */
	List<Inscription> findAllByPlateau(Long id);
}
