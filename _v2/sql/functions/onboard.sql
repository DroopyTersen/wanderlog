CREATE OR REPLACE FUNCTION public.onboard_user(userid text, pwd text, display_name text)
 RETURNS SETOF auth
 LANGUAGE sql
AS $function$

    INSERT INTO users (username, name, role) VALUES (
        userid, 
        display_name, 
        'user'
    );
    INSERT INTO auth (username, password) VALUES (
        userid,
        crypt(pwd, gen_salt('bf'))
    );

    SELECT * from auth where username = userid;
$function$
