<?php

/**
 * A fieldtype for setting a focal point on an image
 *
 * @author Caleb Evans
 *
 * Class PerchFieldType_focalpoint
 */
class PerchFieldType_focalpoint extends PerchFieldType
{

    public $processed_output_is_markup = true;

    public function add_page_resources()
    {
        $Perch = Perch::fetch();
        $Perch->add_css(PERCH_LOGINPATH.'/addons/fieldtypes/focalpoint/assets/css/focalpoint.css');
        $Perch->add_javascript(PERCH_LOGINPATH.'/addons/fieldtypes/focalpoint/assets/js/focalpoint.js');
    }

    public function render_inputs($details = [])
    {
        $id = $this->Tag->input_id();
        $val = isset($details[$id]) ? $details[$id] : '';

        $image_field = $this->Tag->image();

        if ($image_field == '') {
            return '<p>You must set an associated image id for the focal point fieldtype in your template - include attribute image="<image-id>"</p>';
        }

        $s = '<button type="button" class="button button-simple fi-trigger" data-imagefield="'.$this->Tag->post_prefix().$image_field.'" data-target="'.$id.'" data-focus="'.$val.'">Set Focal Point</button>';
        $s .= '<button type="button" class="button button-small" id="'.$id.'_toggle_preview">Toggle preview</button>';
        $s .= '<div style="display:none;width:300px;height:300px;margin:10px 0;background-size:cover;" id="'.$id.'_preview"></div>';
        $s .= $this->Form->hidden($id, $val);

        return $s;
    }

    public function get_processed($raw = false)
    {
        $item = $raw;

        if ($this->Tag->output()) {
            switch ($this->Tag->output()) {
                case 'background-position':
                {
                    $coords = explode(',', $item);
                    if (is_array($coords)) {
                        list($left, $top) = $this->get_percentages($coords);

                        return "background-position: $left% $top%;";
                    }
                }
                case 'absolute': // Not sure how much use this is.  To be useful, The container size would be required
                {
                    $coords = explode(',', $item);
                    if (is_array($coords)) {
                        list($left, $top) = $this->get_percentages($coords);

                        return "left: $left%; top: $top%;";
                    }
                }
            }
        }

        return $item;
    }

    /**
     * @param $coords
     * @return float[]|int[]
     */
    public function get_percentages($coords)
    {
        $x = $coords[0];
        $y = $coords[1];
        $left = (($x + 1) / 2) * 100;
        $top = (1 - (($y + 1) / 2)) * 100;

        return [$left, $top];
    }

}