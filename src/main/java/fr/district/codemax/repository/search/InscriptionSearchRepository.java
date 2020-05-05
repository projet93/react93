package fr.district.codemax.repository.search;

import fr.district.codemax.domain.Inscription;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Inscription} entity.
 */
public interface InscriptionSearchRepository extends ElasticsearchRepository<Inscription, Long> {
}
