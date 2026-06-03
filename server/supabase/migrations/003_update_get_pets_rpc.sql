
CREATE OR REPLACE FUNCTION get_pets_with_shelter(p_species text DEFAULT NULL)
RETURNS json
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(json_agg(row_data), '[]'::json)
  FROM (
    SELECT json_build_object(
      'id', p.id,
      'shelter_id', p.shelter_id,
      'name', p.name,
      'species', p.species,
      'breed', p.breed,
      'age', p.age,
      'size', p.size,
      'gender', p.gender,
      'description', p.description,
      'image_url', p.image_url,
      'latitude', p.latitude,
      'longitude', p.longitude,
      'status', p.status,
      'created_at', p.created_at,
      'shelter', json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email
      )
    ) AS row_data
    FROM pets p
    INNER JOIN users u ON u.id = p.shelter_id
    WHERE (p_species IS NULL OR p.species ILIKE p_species)
    ORDER BY p.created_at DESC
  ) sub;
$$;
