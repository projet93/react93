package fr.district.codemax.web.rest;

import fr.district.codemax.React93App;
import fr.district.codemax.domain.Inscription;
import fr.district.codemax.repository.InscriptionRepository;
import fr.district.codemax.repository.search.InscriptionSearchRepository;
import fr.district.codemax.service.InscriptionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link InscriptionResource} REST controller.
 */
@SpringBootTest(classes = React93App.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class InscriptionResourceIT {

    private static final Integer DEFAULT_NOMBRE_EQUIPE = 1;
    private static final Integer UPDATED_NOMBRE_EQUIPE = 2;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private InscriptionService inscriptionService;

    /**
     * This repository is mocked in the fr.district.codemax.repository.search test package.
     *
     * @see fr.district.codemax.repository.search.InscriptionSearchRepositoryMockConfiguration
     */
    @Autowired
    private InscriptionSearchRepository mockInscriptionSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInscriptionMockMvc;

    private Inscription inscription;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inscription createEntity(EntityManager em) {
        Inscription inscription = new Inscription()
            .nombreEquipe(DEFAULT_NOMBRE_EQUIPE);
        return inscription;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inscription createUpdatedEntity(EntityManager em) {
        Inscription inscription = new Inscription()
            .nombreEquipe(UPDATED_NOMBRE_EQUIPE);
        return inscription;
    }

    @BeforeEach
    public void initTest() {
        inscription = createEntity(em);
    }

    @Test
    @Transactional
    public void createInscription() throws Exception {
        int databaseSizeBeforeCreate = inscriptionRepository.findAll().size();

        // Create the Inscription
        restInscriptionMockMvc.perform(post("/api/inscriptions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(inscription)))
            .andExpect(status().isCreated());

        // Validate the Inscription in the database
        List<Inscription> inscriptionList = inscriptionRepository.findAll();
        assertThat(inscriptionList).hasSize(databaseSizeBeforeCreate + 1);
        Inscription testInscription = inscriptionList.get(inscriptionList.size() - 1);
        assertThat(testInscription.getNombreEquipe()).isEqualTo(DEFAULT_NOMBRE_EQUIPE);

        // Validate the Inscription in Elasticsearch
        verify(mockInscriptionSearchRepository, times(1)).save(testInscription);
    }

    @Test
    @Transactional
    public void createInscriptionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = inscriptionRepository.findAll().size();

        // Create the Inscription with an existing ID
        inscription.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restInscriptionMockMvc.perform(post("/api/inscriptions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(inscription)))
            .andExpect(status().isBadRequest());

        // Validate the Inscription in the database
        List<Inscription> inscriptionList = inscriptionRepository.findAll();
        assertThat(inscriptionList).hasSize(databaseSizeBeforeCreate);

        // Validate the Inscription in Elasticsearch
        verify(mockInscriptionSearchRepository, times(0)).save(inscription);
    }


    @Test
    @Transactional
    public void checkNombreEquipeIsRequired() throws Exception {
        int databaseSizeBeforeTest = inscriptionRepository.findAll().size();
        // set the field null
        inscription.setNombreEquipe(null);

        // Create the Inscription, which fails.

        restInscriptionMockMvc.perform(post("/api/inscriptions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(inscription)))
            .andExpect(status().isBadRequest());

        List<Inscription> inscriptionList = inscriptionRepository.findAll();
        assertThat(inscriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllInscriptions() throws Exception {
        // Initialize the database
        inscriptionRepository.saveAndFlush(inscription);

        // Get all the inscriptionList
        restInscriptionMockMvc.perform(get("/api/inscriptions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(inscription.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombreEquipe").value(hasItem(DEFAULT_NOMBRE_EQUIPE)));
    }
    
    @Test
    @Transactional
    public void getInscription() throws Exception {
        // Initialize the database
        inscriptionRepository.saveAndFlush(inscription);

        // Get the inscription
        restInscriptionMockMvc.perform(get("/api/inscriptions/{id}", inscription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(inscription.getId().intValue()))
            .andExpect(jsonPath("$.nombreEquipe").value(DEFAULT_NOMBRE_EQUIPE));
    }

    @Test
    @Transactional
    public void getNonExistingInscription() throws Exception {
        // Get the inscription
        restInscriptionMockMvc.perform(get("/api/inscriptions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateInscription() throws Exception {
        // Initialize the database
        inscriptionService.save(inscription);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockInscriptionSearchRepository);

        int databaseSizeBeforeUpdate = inscriptionRepository.findAll().size();

        // Update the inscription
        Inscription updatedInscription = inscriptionRepository.findById(inscription.getId()).get();
        // Disconnect from session so that the updates on updatedInscription are not directly saved in db
        em.detach(updatedInscription);
        updatedInscription
            .nombreEquipe(UPDATED_NOMBRE_EQUIPE);

        restInscriptionMockMvc.perform(put("/api/inscriptions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedInscription)))
            .andExpect(status().isOk());

        // Validate the Inscription in the database
        List<Inscription> inscriptionList = inscriptionRepository.findAll();
        assertThat(inscriptionList).hasSize(databaseSizeBeforeUpdate);
        Inscription testInscription = inscriptionList.get(inscriptionList.size() - 1);
        assertThat(testInscription.getNombreEquipe()).isEqualTo(UPDATED_NOMBRE_EQUIPE);

        // Validate the Inscription in Elasticsearch
        verify(mockInscriptionSearchRepository, times(1)).save(testInscription);
    }

    @Test
    @Transactional
    public void updateNonExistingInscription() throws Exception {
        int databaseSizeBeforeUpdate = inscriptionRepository.findAll().size();

        // Create the Inscription

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInscriptionMockMvc.perform(put("/api/inscriptions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(inscription)))
            .andExpect(status().isBadRequest());

        // Validate the Inscription in the database
        List<Inscription> inscriptionList = inscriptionRepository.findAll();
        assertThat(inscriptionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Inscription in Elasticsearch
        verify(mockInscriptionSearchRepository, times(0)).save(inscription);
    }

    @Test
    @Transactional
    public void deleteInscription() throws Exception {
        // Initialize the database
        inscriptionService.save(inscription);

        int databaseSizeBeforeDelete = inscriptionRepository.findAll().size();

        // Delete the inscription
        restInscriptionMockMvc.perform(delete("/api/inscriptions/{id}", inscription.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Inscription> inscriptionList = inscriptionRepository.findAll();
        assertThat(inscriptionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Inscription in Elasticsearch
        verify(mockInscriptionSearchRepository, times(1)).deleteById(inscription.getId());
    }

    @Test
    @Transactional
    public void searchInscription() throws Exception {
        // Initialize the database
        inscriptionService.save(inscription);
        when(mockInscriptionSearchRepository.search(queryStringQuery("id:" + inscription.getId())))
            .thenReturn(Collections.singletonList(inscription));
        // Search the inscription
        restInscriptionMockMvc.perform(get("/api/_search/inscriptions?query=id:" + inscription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(inscription.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombreEquipe").value(hasItem(DEFAULT_NOMBRE_EQUIPE)));
    }
}
