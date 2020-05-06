package fr.district.codemax.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.persistence.LockModeType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.district.codemax.domain.Club;
import fr.district.codemax.domain.Inscription;
import fr.district.codemax.domain.Plateau;
import fr.district.codemax.domain.enumeration.Statut;
import fr.district.codemax.repository.ClubRepository;
import fr.district.codemax.repository.InscriptionRepository;
import fr.district.codemax.repository.PlateauRepository;
import fr.district.codemax.repository.search.InscriptionSearchRepository;
import fr.district.codemax.service.InscriptionService;
import fr.district.codemax.web.rest.errors.BadRequestAlertException;

/**
 * Service Implementation for managing {@link Inscription}.
 */
@Service
@Transactional
public class InscriptionServiceImpl implements InscriptionService {

	private final Logger log = LoggerFactory.getLogger(InscriptionServiceImpl.class);

	@Autowired
	private InscriptionRepository inscriptionRepository;

	@Autowired
	private PlateauRepository plateauRepository;
	
	@Autowired
	private ClubRepository clubRepository;

	@Autowired
	private InscriptionSearchRepository inscriptionSearchRepository;

	public InscriptionServiceImpl() {
	}

	/**
	 * Save a inscription.
	 *
	 * @param inscription the entity to save.
	 * @return the persisted entity.
	 */
	@Override
	@Transactional
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	public Inscription save(Inscription inscription) {
		log.debug("Request to save Inscription : {}", inscription);
		// il faut faire l'update ( tester if (id != null) refaire le calcule
		Plateau plateau = plateauRepository.findOneWithEagerRelationships(inscription.getPlateau().getId()).get();
		Integer nbrMax = plateau.getNombreEquipeMax();
		Integer nbrParticipant = plateau.getNombreEquipe();
		if (nbrMax < (inscription.getNombreEquipe() + nbrParticipant)) {
			throw new BadRequestAlertException("impossible de faire l'inscription", "inscription", "");
		}
		if ((nbrMax - (nbrParticipant + inscription.getNombreEquipe())) == 0)
			plateau.setStatut(Statut.COMPLET);
		Club club = clubRepository.findClubByUserIsCurrentUser().get();
		plateau.setNombreEquipe(nbrParticipant + inscription.getNombreEquipe());
		inscription.setClub(club);
		inscription.setPlateau(plateau);
		plateau.addInscription(inscription);
		plateauRepository.save(plateau);
//		inscription.setPlateau(plateau);
//		inscription.setClub(clubRepository.findClubByUserIsCurrentUser().get());
		Inscription result = inscriptionRepository.save(inscription);
		inscriptionSearchRepository.save(result);
		return inscription;
	}

	@Override
	public void saveInit(Inscription inscription) {
		log.debug("Request to save Inscription : {}", inscription);
		Inscription result = inscriptionRepository.save(inscription);
		inscriptionSearchRepository.save(result);
	}
	@Override
    @Transactional
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public Inscription update(Inscription inscription) {
        log.debug("Request to save Inscription : {}", inscription);
        // il faut faire l'update ( tester if (id != null) refaire le calcule 
        Plateau plateau = plateauRepository.findOneWithEagerRelationships(inscription.getPlateau().getId()).get();
        Inscription oldInscrition = inscriptionRepository.getOne(inscription.getId());
        Integer nbrMax = plateau.getNombreEquipeMax();
        Integer nbrParticipant = plateau.getNombreEquipe();
        nbrParticipant += (inscription.getNombreEquipe() - oldInscrition.getNombreEquipe());
        	
        
        if(nbrMax < (nbrParticipant)) {
        	throw new BadRequestAlertException("impossible de faire l'inscription","inscription","maxequipe");
        }
        if((nbrMax-(nbrParticipant)) == 0)
        	plateau.setStatut(Statut.COMPLET);
        else
        	plateau.setStatut(Statut.ENCOURS);
        plateau.setNombreEquipe(nbrParticipant);
        plateauRepository.save(plateau);
        inscription.setPlateau(plateau);
        Inscription result = inscriptionRepository.save(inscription);
        inscriptionSearchRepository.save(result);
        return result;
    }

	/**
	 * Get all the inscriptions.
	 *
	 * @return the list of entities.
	 */
	@Override
	@Transactional(readOnly = true)
	public List<Inscription> findAll() {
		log.debug("Request to get all Inscriptions");
		return inscriptionRepository.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Inscription> findAllByPlateau(Long id) {
		log.debug("Request to get all Inscriptions");
		return inscriptionRepository.findAllByPlateau(id);
	}

	/**
	 * Get one inscription by id.
	 *
	 * @param id the id of the entity.
	 * @return the entity.
	 */
	@Override
	@Transactional(readOnly = true)
	public Optional<Inscription> findOne(Long id) {
		log.debug("Request to get Inscription : {}", id);
		return inscriptionRepository.findById(id);
	}

	/**
	 * Delete the inscription by id.
	 *
	 * @param id the id of the entity.
	 */
	@Override
	public void delete(Long id) {
		log.debug("Request to delete Inscription : {}", id);
		Inscription inscription = inscriptionRepository.getOne(id);
		Plateau plateau = plateauRepository.findOneWithEagerRelationships(inscription.getPlateau().getId()).get();
		plateau.setNombreEquipe(plateau.getNombreEquipe() - inscription.getNombreEquipe());
		plateau.setStatut(Statut.ENCOURS);
		plateau.removeInscription(inscription);
		inscriptionRepository.deleteById(id);
		plateauRepository.save(plateau);
		inscriptionSearchRepository.deleteById(id);
	}

	/**
	 * Search for the inscription corresponding to the query.
	 *
	 * @param query the query of the search.
	 * @return the list of entities.
	 */
	@Override
	@Transactional(readOnly = true)
	public List<Inscription> search(String query) {
		log.debug("Request to search Inscriptions for query {}", query);
		return StreamSupport.stream(inscriptionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
				.collect(Collectors.toList());
	}

	
}
