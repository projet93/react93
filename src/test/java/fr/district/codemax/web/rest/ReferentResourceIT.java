package fr.district.codemax.web.rest;

import fr.district.codemax.React93App;
import fr.district.codemax.domain.Referent;
import fr.district.codemax.domain.User;
import fr.district.codemax.repository.ReferentRepository;
import fr.district.codemax.repository.search.ReferentSearchRepository;
import fr.district.codemax.service.ReferentService;
import fr.district.codemax.service.dto.ReferentCriteria;
import fr.district.codemax.service.ReferentQueryService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
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
 * Integration tests for the {@link ReferentResource} REST controller.
 */
@SpringBootTest(classes = React93App.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ReferentResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_LICENCE = "AAAAAAAAAA";
    private static final String UPDATED_LICENCE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    @Autowired
    private ReferentRepository referentRepository;

    @Autowired
    private ReferentService referentService;

    /**
     * This repository is mocked in the fr.district.codemax.repository.search test package.
     *
     * @see fr.district.codemax.repository.search.ReferentSearchRepositoryMockConfiguration
     */
    @Autowired
    private ReferentSearchRepository mockReferentSearchRepository;

    @Autowired
    private ReferentQueryService referentQueryService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReferentMockMvc;

    private Referent referent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Referent createEntity(EntityManager em) {
        Referent referent = new Referent()
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .licence(DEFAULT_LICENCE)
            .telephone(DEFAULT_TELEPHONE)
            .email(DEFAULT_EMAIL);
        return referent;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Referent createUpdatedEntity(EntityManager em) {
        Referent referent = new Referent()
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .licence(UPDATED_LICENCE)
            .telephone(UPDATED_TELEPHONE)
            .email(UPDATED_EMAIL);
        return referent;
    }

    @BeforeEach
    public void initTest() {
        referent = createEntity(em);
    }

    @Test
    @Transactional
    public void createReferent() throws Exception {
        int databaseSizeBeforeCreate = referentRepository.findAll().size();

        // Create the Referent
        restReferentMockMvc.perform(post("/api/referents")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(referent)))
            .andExpect(status().isCreated());

        // Validate the Referent in the database
        List<Referent> referentList = referentRepository.findAll();
        assertThat(referentList).hasSize(databaseSizeBeforeCreate + 1);
        Referent testReferent = referentList.get(referentList.size() - 1);
        assertThat(testReferent.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testReferent.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testReferent.getLicence()).isEqualTo(DEFAULT_LICENCE);
        assertThat(testReferent.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testReferent.getEmail()).isEqualTo(DEFAULT_EMAIL);

        // Validate the Referent in Elasticsearch
        verify(mockReferentSearchRepository, times(1)).save(testReferent);
    }

    @Test
    @Transactional
    public void createReferentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = referentRepository.findAll().size();

        // Create the Referent with an existing ID
        referent.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restReferentMockMvc.perform(post("/api/referents")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(referent)))
            .andExpect(status().isBadRequest());

        // Validate the Referent in the database
        List<Referent> referentList = referentRepository.findAll();
        assertThat(referentList).hasSize(databaseSizeBeforeCreate);

        // Validate the Referent in Elasticsearch
        verify(mockReferentSearchRepository, times(0)).save(referent);
    }


    @Test
    @Transactional
    public void getAllReferents() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList
        restReferentMockMvc.perform(get("/api/referents?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(referent.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].licence").value(hasItem(DEFAULT_LICENCE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }
    
    @Test
    @Transactional
    public void getReferent() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get the referent
        restReferentMockMvc.perform(get("/api/referents/{id}", referent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(referent.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.licence").value(DEFAULT_LICENCE))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL));
    }


    @Test
    @Transactional
    public void getReferentsByIdFiltering() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        Long id = referent.getId();

        defaultReferentShouldBeFound("id.equals=" + id);
        defaultReferentShouldNotBeFound("id.notEquals=" + id);

        defaultReferentShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultReferentShouldNotBeFound("id.greaterThan=" + id);

        defaultReferentShouldBeFound("id.lessThanOrEqual=" + id);
        defaultReferentShouldNotBeFound("id.lessThan=" + id);
    }


    @Test
    @Transactional
    public void getAllReferentsByNomIsEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where nom equals to DEFAULT_NOM
        defaultReferentShouldBeFound("nom.equals=" + DEFAULT_NOM);

        // Get all the referentList where nom equals to UPDATED_NOM
        defaultReferentShouldNotBeFound("nom.equals=" + UPDATED_NOM);
    }

    @Test
    @Transactional
    public void getAllReferentsByNomIsNotEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where nom not equals to DEFAULT_NOM
        defaultReferentShouldNotBeFound("nom.notEquals=" + DEFAULT_NOM);

        // Get all the referentList where nom not equals to UPDATED_NOM
        defaultReferentShouldBeFound("nom.notEquals=" + UPDATED_NOM);
    }

    @Test
    @Transactional
    public void getAllReferentsByNomIsInShouldWork() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where nom in DEFAULT_NOM or UPDATED_NOM
        defaultReferentShouldBeFound("nom.in=" + DEFAULT_NOM + "," + UPDATED_NOM);

        // Get all the referentList where nom equals to UPDATED_NOM
        defaultReferentShouldNotBeFound("nom.in=" + UPDATED_NOM);
    }

    @Test
    @Transactional
    public void getAllReferentsByNomIsNullOrNotNull() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where nom is not null
        defaultReferentShouldBeFound("nom.specified=true");

        // Get all the referentList where nom is null
        defaultReferentShouldNotBeFound("nom.specified=false");
    }
                @Test
    @Transactional
    public void getAllReferentsByNomContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where nom contains DEFAULT_NOM
        defaultReferentShouldBeFound("nom.contains=" + DEFAULT_NOM);

        // Get all the referentList where nom contains UPDATED_NOM
        defaultReferentShouldNotBeFound("nom.contains=" + UPDATED_NOM);
    }

    @Test
    @Transactional
    public void getAllReferentsByNomNotContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where nom does not contain DEFAULT_NOM
        defaultReferentShouldNotBeFound("nom.doesNotContain=" + DEFAULT_NOM);

        // Get all the referentList where nom does not contain UPDATED_NOM
        defaultReferentShouldBeFound("nom.doesNotContain=" + UPDATED_NOM);
    }


    @Test
    @Transactional
    public void getAllReferentsByPrenomIsEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where prenom equals to DEFAULT_PRENOM
        defaultReferentShouldBeFound("prenom.equals=" + DEFAULT_PRENOM);

        // Get all the referentList where prenom equals to UPDATED_PRENOM
        defaultReferentShouldNotBeFound("prenom.equals=" + UPDATED_PRENOM);
    }

    @Test
    @Transactional
    public void getAllReferentsByPrenomIsNotEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where prenom not equals to DEFAULT_PRENOM
        defaultReferentShouldNotBeFound("prenom.notEquals=" + DEFAULT_PRENOM);

        // Get all the referentList where prenom not equals to UPDATED_PRENOM
        defaultReferentShouldBeFound("prenom.notEquals=" + UPDATED_PRENOM);
    }

    @Test
    @Transactional
    public void getAllReferentsByPrenomIsInShouldWork() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where prenom in DEFAULT_PRENOM or UPDATED_PRENOM
        defaultReferentShouldBeFound("prenom.in=" + DEFAULT_PRENOM + "," + UPDATED_PRENOM);

        // Get all the referentList where prenom equals to UPDATED_PRENOM
        defaultReferentShouldNotBeFound("prenom.in=" + UPDATED_PRENOM);
    }

    @Test
    @Transactional
    public void getAllReferentsByPrenomIsNullOrNotNull() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where prenom is not null
        defaultReferentShouldBeFound("prenom.specified=true");

        // Get all the referentList where prenom is null
        defaultReferentShouldNotBeFound("prenom.specified=false");
    }
                @Test
    @Transactional
    public void getAllReferentsByPrenomContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where prenom contains DEFAULT_PRENOM
        defaultReferentShouldBeFound("prenom.contains=" + DEFAULT_PRENOM);

        // Get all the referentList where prenom contains UPDATED_PRENOM
        defaultReferentShouldNotBeFound("prenom.contains=" + UPDATED_PRENOM);
    }

    @Test
    @Transactional
    public void getAllReferentsByPrenomNotContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where prenom does not contain DEFAULT_PRENOM
        defaultReferentShouldNotBeFound("prenom.doesNotContain=" + DEFAULT_PRENOM);

        // Get all the referentList where prenom does not contain UPDATED_PRENOM
        defaultReferentShouldBeFound("prenom.doesNotContain=" + UPDATED_PRENOM);
    }


    @Test
    @Transactional
    public void getAllReferentsByLicenceIsEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where licence equals to DEFAULT_LICENCE
        defaultReferentShouldBeFound("licence.equals=" + DEFAULT_LICENCE);

        // Get all the referentList where licence equals to UPDATED_LICENCE
        defaultReferentShouldNotBeFound("licence.equals=" + UPDATED_LICENCE);
    }

    @Test
    @Transactional
    public void getAllReferentsByLicenceIsNotEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where licence not equals to DEFAULT_LICENCE
        defaultReferentShouldNotBeFound("licence.notEquals=" + DEFAULT_LICENCE);

        // Get all the referentList where licence not equals to UPDATED_LICENCE
        defaultReferentShouldBeFound("licence.notEquals=" + UPDATED_LICENCE);
    }

    @Test
    @Transactional
    public void getAllReferentsByLicenceIsInShouldWork() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where licence in DEFAULT_LICENCE or UPDATED_LICENCE
        defaultReferentShouldBeFound("licence.in=" + DEFAULT_LICENCE + "," + UPDATED_LICENCE);

        // Get all the referentList where licence equals to UPDATED_LICENCE
        defaultReferentShouldNotBeFound("licence.in=" + UPDATED_LICENCE);
    }

    @Test
    @Transactional
    public void getAllReferentsByLicenceIsNullOrNotNull() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where licence is not null
        defaultReferentShouldBeFound("licence.specified=true");

        // Get all the referentList where licence is null
        defaultReferentShouldNotBeFound("licence.specified=false");
    }
                @Test
    @Transactional
    public void getAllReferentsByLicenceContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where licence contains DEFAULT_LICENCE
        defaultReferentShouldBeFound("licence.contains=" + DEFAULT_LICENCE);

        // Get all the referentList where licence contains UPDATED_LICENCE
        defaultReferentShouldNotBeFound("licence.contains=" + UPDATED_LICENCE);
    }

    @Test
    @Transactional
    public void getAllReferentsByLicenceNotContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where licence does not contain DEFAULT_LICENCE
        defaultReferentShouldNotBeFound("licence.doesNotContain=" + DEFAULT_LICENCE);

        // Get all the referentList where licence does not contain UPDATED_LICENCE
        defaultReferentShouldBeFound("licence.doesNotContain=" + UPDATED_LICENCE);
    }


    @Test
    @Transactional
    public void getAllReferentsByTelephoneIsEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where telephone equals to DEFAULT_TELEPHONE
        defaultReferentShouldBeFound("telephone.equals=" + DEFAULT_TELEPHONE);

        // Get all the referentList where telephone equals to UPDATED_TELEPHONE
        defaultReferentShouldNotBeFound("telephone.equals=" + UPDATED_TELEPHONE);
    }

    @Test
    @Transactional
    public void getAllReferentsByTelephoneIsNotEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where telephone not equals to DEFAULT_TELEPHONE
        defaultReferentShouldNotBeFound("telephone.notEquals=" + DEFAULT_TELEPHONE);

        // Get all the referentList where telephone not equals to UPDATED_TELEPHONE
        defaultReferentShouldBeFound("telephone.notEquals=" + UPDATED_TELEPHONE);
    }

    @Test
    @Transactional
    public void getAllReferentsByTelephoneIsInShouldWork() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where telephone in DEFAULT_TELEPHONE or UPDATED_TELEPHONE
        defaultReferentShouldBeFound("telephone.in=" + DEFAULT_TELEPHONE + "," + UPDATED_TELEPHONE);

        // Get all the referentList where telephone equals to UPDATED_TELEPHONE
        defaultReferentShouldNotBeFound("telephone.in=" + UPDATED_TELEPHONE);
    }

    @Test
    @Transactional
    public void getAllReferentsByTelephoneIsNullOrNotNull() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where telephone is not null
        defaultReferentShouldBeFound("telephone.specified=true");

        // Get all the referentList where telephone is null
        defaultReferentShouldNotBeFound("telephone.specified=false");
    }
                @Test
    @Transactional
    public void getAllReferentsByTelephoneContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where telephone contains DEFAULT_TELEPHONE
        defaultReferentShouldBeFound("telephone.contains=" + DEFAULT_TELEPHONE);

        // Get all the referentList where telephone contains UPDATED_TELEPHONE
        defaultReferentShouldNotBeFound("telephone.contains=" + UPDATED_TELEPHONE);
    }

    @Test
    @Transactional
    public void getAllReferentsByTelephoneNotContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where telephone does not contain DEFAULT_TELEPHONE
        defaultReferentShouldNotBeFound("telephone.doesNotContain=" + DEFAULT_TELEPHONE);

        // Get all the referentList where telephone does not contain UPDATED_TELEPHONE
        defaultReferentShouldBeFound("telephone.doesNotContain=" + UPDATED_TELEPHONE);
    }


    @Test
    @Transactional
    public void getAllReferentsByEmailIsEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where email equals to DEFAULT_EMAIL
        defaultReferentShouldBeFound("email.equals=" + DEFAULT_EMAIL);

        // Get all the referentList where email equals to UPDATED_EMAIL
        defaultReferentShouldNotBeFound("email.equals=" + UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void getAllReferentsByEmailIsNotEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where email not equals to DEFAULT_EMAIL
        defaultReferentShouldNotBeFound("email.notEquals=" + DEFAULT_EMAIL);

        // Get all the referentList where email not equals to UPDATED_EMAIL
        defaultReferentShouldBeFound("email.notEquals=" + UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void getAllReferentsByEmailIsInShouldWork() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where email in DEFAULT_EMAIL or UPDATED_EMAIL
        defaultReferentShouldBeFound("email.in=" + DEFAULT_EMAIL + "," + UPDATED_EMAIL);

        // Get all the referentList where email equals to UPDATED_EMAIL
        defaultReferentShouldNotBeFound("email.in=" + UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void getAllReferentsByEmailIsNullOrNotNull() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where email is not null
        defaultReferentShouldBeFound("email.specified=true");

        // Get all the referentList where email is null
        defaultReferentShouldNotBeFound("email.specified=false");
    }
                @Test
    @Transactional
    public void getAllReferentsByEmailContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where email contains DEFAULT_EMAIL
        defaultReferentShouldBeFound("email.contains=" + DEFAULT_EMAIL);

        // Get all the referentList where email contains UPDATED_EMAIL
        defaultReferentShouldNotBeFound("email.contains=" + UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void getAllReferentsByEmailNotContainsSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);

        // Get all the referentList where email does not contain DEFAULT_EMAIL
        defaultReferentShouldNotBeFound("email.doesNotContain=" + DEFAULT_EMAIL);

        // Get all the referentList where email does not contain UPDATED_EMAIL
        defaultReferentShouldBeFound("email.doesNotContain=" + UPDATED_EMAIL);
    }


    @Test
    @Transactional
    public void getAllReferentsByUserIsEqualToSomething() throws Exception {
        // Initialize the database
        referentRepository.saveAndFlush(referent);
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        referent.setUser(user);
        referentRepository.saveAndFlush(referent);
        Long userId = user.getId();

        // Get all the referentList where user equals to userId
        defaultReferentShouldBeFound("userId.equals=" + userId);

        // Get all the referentList where user equals to userId + 1
        defaultReferentShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultReferentShouldBeFound(String filter) throws Exception {
        restReferentMockMvc.perform(get("/api/referents?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(referent.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].licence").value(hasItem(DEFAULT_LICENCE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));

        // Check, that the count call also returns 1
        restReferentMockMvc.perform(get("/api/referents/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultReferentShouldNotBeFound(String filter) throws Exception {
        restReferentMockMvc.perform(get("/api/referents?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restReferentMockMvc.perform(get("/api/referents/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingReferent() throws Exception {
        // Get the referent
        restReferentMockMvc.perform(get("/api/referents/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateReferent() throws Exception {
        // Initialize the database
        referentService.save(referent);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockReferentSearchRepository);

        int databaseSizeBeforeUpdate = referentRepository.findAll().size();

        // Update the referent
        Referent updatedReferent = referentRepository.findById(referent.getId()).get();
        // Disconnect from session so that the updates on updatedReferent are not directly saved in db
        em.detach(updatedReferent);
        updatedReferent
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .licence(UPDATED_LICENCE)
            .telephone(UPDATED_TELEPHONE)
            .email(UPDATED_EMAIL);

        restReferentMockMvc.perform(put("/api/referents")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedReferent)))
            .andExpect(status().isOk());

        // Validate the Referent in the database
        List<Referent> referentList = referentRepository.findAll();
        assertThat(referentList).hasSize(databaseSizeBeforeUpdate);
        Referent testReferent = referentList.get(referentList.size() - 1);
        assertThat(testReferent.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testReferent.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testReferent.getLicence()).isEqualTo(UPDATED_LICENCE);
        assertThat(testReferent.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testReferent.getEmail()).isEqualTo(UPDATED_EMAIL);

        // Validate the Referent in Elasticsearch
        verify(mockReferentSearchRepository, times(1)).save(testReferent);
    }

    @Test
    @Transactional
    public void updateNonExistingReferent() throws Exception {
        int databaseSizeBeforeUpdate = referentRepository.findAll().size();

        // Create the Referent

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReferentMockMvc.perform(put("/api/referents")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(referent)))
            .andExpect(status().isBadRequest());

        // Validate the Referent in the database
        List<Referent> referentList = referentRepository.findAll();
        assertThat(referentList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Referent in Elasticsearch
        verify(mockReferentSearchRepository, times(0)).save(referent);
    }

    @Test
    @Transactional
    public void deleteReferent() throws Exception {
        // Initialize the database
        referentService.save(referent);

        int databaseSizeBeforeDelete = referentRepository.findAll().size();

        // Delete the referent
        restReferentMockMvc.perform(delete("/api/referents/{id}", referent.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Referent> referentList = referentRepository.findAll();
        assertThat(referentList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Referent in Elasticsearch
        verify(mockReferentSearchRepository, times(1)).deleteById(referent.getId());
    }

    @Test
    @Transactional
    public void searchReferent() throws Exception {
        // Initialize the database
        referentService.save(referent);
        when(mockReferentSearchRepository.search(queryStringQuery("id:" + referent.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(referent), PageRequest.of(0, 1), 1));
        // Search the referent
        restReferentMockMvc.perform(get("/api/_search/referents?query=id:" + referent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(referent.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].licence").value(hasItem(DEFAULT_LICENCE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }
}
