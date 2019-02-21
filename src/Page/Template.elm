module Page.Template exposing (viewHeader)

import Html exposing (Html, header, h1, ul, li, text, img, a, br)
import Html.Attributes exposing (id, src, href, class)
import Html.Events exposing (onClick)

viewHeader : Maybe a -> msg -> Html msg
viewHeader user msg =
    header []
        [ h1 [] [ text "memorize.ai" ]
        , ul []
            [ li []
                [ case user of
                    Nothing -> text ""
                    Just _ -> a [ onClick msg, href "#" ] [ text "Sign out" ]
                ]
            ]
        ]
