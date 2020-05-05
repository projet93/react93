package fr.district.codemax.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import fr.district.codemax.domain.enumeration.Statut;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;
import io.github.jhipster.service.filter.InstantFilter;

/**
 * Criteria class for the {@link fr.district.codemax.domain.Plateau} entity. This class is used
 * in {@link fr.district.codemax.web.rest.PlateauResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /plateaus?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class PlateauCriteria implements Serializable, Criteria {
    /**
     * Class for filtering Statut
     */
    public static class StatutFilter extends Filter<Statut> {

        public StatutFilter() {
        }

        public StatutFilter(StatutFilter filter) {
            super(filter);
        }

        @Override
        public StatutFilter copy() {
            return new StatutFilter(this);
        }

    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private InstantFilter dateDebut;

    private InstantFilter dateFin;

    private IntegerFilter nombreEquipeMax;

    private IntegerFilter nombreEquipe;

    private StatutFilter statut;

    private BooleanFilter valid;

    private LongFilter version;

    private LongFilter inscriptionId;

    private LongFilter referentId;

    private LongFilter userId;

    private LongFilter stadeId;

    private LongFilter categorieId;

    public PlateauCriteria() {
    }

    public PlateauCriteria(PlateauCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.dateDebut = other.dateDebut == null ? null : other.dateDebut.copy();
        this.dateFin = other.dateFin == null ? null : other.dateFin.copy();
        this.nombreEquipeMax = other.nombreEquipeMax == null ? null : other.nombreEquipeMax.copy();
        this.nombreEquipe = other.nombreEquipe == null ? null : other.nombreEquipe.copy();
        this.statut = other.statut == null ? null : other.statut.copy();
        this.valid = other.valid == null ? null : other.valid.copy();
        this.version = other.version == null ? null : other.version.copy();
        this.inscriptionId = other.inscriptionId == null ? null : other.inscriptionId.copy();
        this.referentId = other.referentId == null ? null : other.referentId.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
        this.stadeId = other.stadeId == null ? null : other.stadeId.copy();
        this.categorieId = other.categorieId == null ? null : other.categorieId.copy();
    }

    @Override
    public PlateauCriteria copy() {
        return new PlateauCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public InstantFilter getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(InstantFilter dateDebut) {
        this.dateDebut = dateDebut;
    }

    public InstantFilter getDateFin() {
        return dateFin;
    }

    public void setDateFin(InstantFilter dateFin) {
        this.dateFin = dateFin;
    }

    public IntegerFilter getNombreEquipeMax() {
        return nombreEquipeMax;
    }

    public void setNombreEquipeMax(IntegerFilter nombreEquipeMax) {
        this.nombreEquipeMax = nombreEquipeMax;
    }

    public IntegerFilter getNombreEquipe() {
        return nombreEquipe;
    }

    public void setNombreEquipe(IntegerFilter nombreEquipe) {
        this.nombreEquipe = nombreEquipe;
    }

    public StatutFilter getStatut() {
        return statut;
    }

    public void setStatut(StatutFilter statut) {
        this.statut = statut;
    }

    public BooleanFilter getValid() {
        return valid;
    }

    public void setValid(BooleanFilter valid) {
        this.valid = valid;
    }

    public LongFilter getVersion() {
        return version;
    }

    public void setVersion(LongFilter version) {
        this.version = version;
    }

    public LongFilter getInscriptionId() {
        return inscriptionId;
    }

    public void setInscriptionId(LongFilter inscriptionId) {
        this.inscriptionId = inscriptionId;
    }

    public LongFilter getReferentId() {
        return referentId;
    }

    public void setReferentId(LongFilter referentId) {
        this.referentId = referentId;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    public LongFilter getStadeId() {
        return stadeId;
    }

    public void setStadeId(LongFilter stadeId) {
        this.stadeId = stadeId;
    }

    public LongFilter getCategorieId() {
        return categorieId;
    }

    public void setCategorieId(LongFilter categorieId) {
        this.categorieId = categorieId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final PlateauCriteria that = (PlateauCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(dateDebut, that.dateDebut) &&
            Objects.equals(dateFin, that.dateFin) &&
            Objects.equals(nombreEquipeMax, that.nombreEquipeMax) &&
            Objects.equals(nombreEquipe, that.nombreEquipe) &&
            Objects.equals(statut, that.statut) &&
            Objects.equals(valid, that.valid) &&
            Objects.equals(version, that.version) &&
            Objects.equals(inscriptionId, that.inscriptionId) &&
            Objects.equals(referentId, that.referentId) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(stadeId, that.stadeId) &&
            Objects.equals(categorieId, that.categorieId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        dateDebut,
        dateFin,
        nombreEquipeMax,
        nombreEquipe,
        statut,
        valid,
        version,
        inscriptionId,
        referentId,
        userId,
        stadeId,
        categorieId
        );
    }

    @Override
    public String toString() {
        return "PlateauCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (dateDebut != null ? "dateDebut=" + dateDebut + ", " : "") +
                (dateFin != null ? "dateFin=" + dateFin + ", " : "") +
                (nombreEquipeMax != null ? "nombreEquipeMax=" + nombreEquipeMax + ", " : "") +
                (nombreEquipe != null ? "nombreEquipe=" + nombreEquipe + ", " : "") +
                (statut != null ? "statut=" + statut + ", " : "") +
                (valid != null ? "valid=" + valid + ", " : "") +
                (version != null ? "version=" + version + ", " : "") +
                (inscriptionId != null ? "inscriptionId=" + inscriptionId + ", " : "") +
                (referentId != null ? "referentId=" + referentId + ", " : "") +
                (userId != null ? "userId=" + userId + ", " : "") +
                (stadeId != null ? "stadeId=" + stadeId + ", " : "") +
                (categorieId != null ? "categorieId=" + categorieId + ", " : "") +
            "}";
    }

}
