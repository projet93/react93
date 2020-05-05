package fr.district.codemax.service.impl;

import fr.district.codemax.service.ClubService;
import fr.district.codemax.domain.Club;
import fr.district.codemax.repository.ClubRepository;
import fr.district.codemax.repository.search.ClubSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Club}.
 */
@Service
@Transactional
public class ClubServiceImpl implements ClubService {

    private final Logger log = LoggerFactory.getLogger(ClubServiceImpl.class);

    private final ClubRepository clubRepository;

    private final ClubSearchRepository clubSearchRepository;

    public ClubServiceImpl(ClubRepository clubRepository, ClubSearchRepository clubSearchRepository) {
        this.clubRepository = clubRepository;
        this.clubSearchRepository = clubSearchRepository;
    }

    /**
     * Save a club.
     *
     * @param club the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Club save(Club club) {
        log.debug("Request to save Club : {}", club);
        Club result = clubRepository.save(club);
        clubSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the clubs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Club> findAll(Pageable pageable) {
        log.debug("Request to get all Clubs");
        return clubRepository.findAll(pageable);
    }

    /**
     * Get all the clubs with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Club> findAllWithEagerRelationships(Pageable pageable) {
        return clubRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one club by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Club> findOne(Long id) {
        log.debug("Request to get Club : {}", id);
        return clubRepository.findOneWithEagerRelationships(id);
    }
    
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Club> findByUser() {    	
    	return clubRepository.findClubByUserIsCurrentUser();
    }

    /**
     * Delete the club by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Club : {}", id);
        clubRepository.deleteById(id);
        clubSearchRepository.deleteById(id);
    }

    /**
     * Search for the club corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Club> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Clubs for query {}", query);
        return clubSearchRepository.search(queryStringQuery(query), pageable);    }

    @Override
    @Transactional(readOnly = true)
	public Page<Club> findByUserIsCurrentUser(Pageable pageable) {
		return clubRepository.findByUserIsCurrentUser(pageable);
	}

}
