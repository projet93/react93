package fr.district.codemax.repository.search;

import fr.district.codemax.domain.Plateau;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Plateau} entity.
 */
public interface PlateauSearchRepository extends ElasticsearchRepository<Plateau, Long> {
}
